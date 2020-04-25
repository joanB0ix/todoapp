import * as React from 'react';
import './TodoList.scss';
import { useCookies } from 'react-cookie';
import Todo from './TodoListComponents/Todo/Todo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ClearIcon from '@material-ui/icons/Clear';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default function TodoList(props: any) {

    const axios = require('axios');

    interface todoS {
        name: string;
        description: string;
        category: string;
        _id: string;
    }

    const [list, setList] = React.useState<todoS[]>([]);

    const [categoryToSend, setCategoryToSend] = React.useState("");

    const [cookies, , removeCookie] = useCookies(['token']);

    const [loading, setLoading] = React.useState(false);

    const [todo, setTodo] = React.useState({
        name: "",
        description: "",
        category: "",
        _id: ""
    });

    const [force, setForce] = React.useState(false);

    const [categorySelected, setCategory] = React.useState('MY DAY');

    const [listcategory, setListCategory] = React.useState(['MY DAY', 'GROCERIES']);
    const listIcon = [<Brightness5Icon />, <LocalGroceryStoreIcon />];

    const [toEdit, setEdit] = React.useState(false);
    const [todoEdit, setTodoEdit] = React.useState({ name: "", description: "", _id: "" });

    //Get's the latest information about the user's todos on render.
    React.useEffect(() => {
        axios.get(process.env.REACT_APP_API + '/todos/todolist', {
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            }
        }).then(function (response: any) {
            setList(response.data);
            setLoading(true);
        });

        axios.get(process.env.REACT_APP_API + '/users/categories', {
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            }
        }).then(function (response: any) {
            setListCategory(response.data);
        });

    }, []);


    //This function creates a Category
    function createCategory() {
        if(listcategory.indexOf(categoryToSend) === -1){
            listcategory.push(categoryToSend);
            setListCategory(listcategory);
            setCategory(categoryToSend);            
            setCategoryToSend('');
            axios.put(process.env.REACT_APP_API + '/users/update/add/category/' + categoryToSend, [], {
                headers: {
                    'Authorization': `Bearer ${cookies.token}`
                }
            });
        }
    }

    //This function deletes a Category
    function deleteCategory(item: string, e:any) {
        var index = listcategory.indexOf(item);

        listcategory.splice(index, 1);

        setListCategory(listcategory);

        if(categorySelected == item){
            setCategory(listcategory[index-1]);
        }

        axios.put(process.env.REACT_APP_API + '/users/update/remove/category/' + item, [], {
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            }
        });
        setForce(!force);
        e.stopPropagation();
    }

    //Change handlers that update their respective states on keystroke.
    function changeHandlerTodo(e: any) {

        setTodo({
            ...todo,
            [e.target.name]: e.target.value,
        });

    }

    function changeHandlerCategory(e: any) {

        setCategoryToSend(e.target.value);

    }

    function changeHandlerEdit(e: any) {
        setTodoEdit({
            ...todoEdit,
            [e.target.name]: e.target.value
        });
    }

    //Creates a Todo
    function createTodo() {
        if (todo.name !== "") {
            list.push({name: todo.name, description: todo.description, category: categorySelected, _id:""});
            setList(list);
            setForce(!force);
            axios.post(process.env.REACT_APP_API + '/todos/create', { name: todo.name, description: todo.description, category: categorySelected, checked: false }, {
                headers: {
                    'Authorization': `Bearer ${cookies.token}`
                }
            }).then(
                function(response:any){
                    setList(response.data);
                }
            );
            setTodo({ name: "", description: "", category: "", _id:"" });
        }
    }

    //Updates a Todo
    function updateTodo() {
        if (todoEdit.name !== "") {
            axios.put(process.env.REACT_APP_API + '/todos/update/' + todoEdit._id, { name: todoEdit.name, description: todoEdit.description },
                {
                    headers: {
                        'Authorization': `Bearer ${cookies.token}`
                    }
                }).then(function (response: any) {
                    setList(response.data);
                });
        }
    }

    //Get's the list that we want to display based on category
    function getCategorylist(category: string): any[] {
        let listToReturn: any[] = [];

        list.forEach(element => {
            if (element['category'] == category) {
                listToReturn.push(element);
            }
        });

        return listToReturn;
    }


    function deleteTodo(key: string) {
        for(let i = 0; i < list.length; i++){
            if(key === list[i]['_id']){
                list.splice(i,1);
                break;
            }
        }
        setList(list);
        setForce(!force);
    }

    return (
        <div>
            {
                loading &&
                <div className="todolist-wrapper">
                    <div className="todolist-categories">
                        <div className="todolist-title">
                            <div className="todo-list-adder">
                                <form onSubmit={e => { e.preventDefault(); createCategory() }} className="todo-list-adder">
                                    <AddCircleIcon onClick={createCategory} />
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="ADD CATEGORY"
                                        onChange={changeHandlerCategory}
                                        value={categoryToSend}
                                    >
                                    </input>
                                    <input type="submit" style={{ display: 'none' }}>
                                    </input>
                                </form>
                            </div>
                        </div>
                        <div className="todolist-category-cover">
                            {
                                listcategory.map((item, i) => {
                                    return (
                                        <div key={i} className={"todolist-category-out " + ((categorySelected == item) ? 'active' : '')} onClick={() => setCategory(item)}>
                                            <div className="todolist-category">
                                                {(i >= 2) ? <ClearIcon onClick={e => deleteCategory(item, e)} className="todolist-category-cross" /> : listIcon[i]}
                                                <span>
                                                    {item}
                                                </span>
                                            </div>
                                            <div className={((categorySelected == item) ? "todolist-side-active" : "todolist-side")}>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="todolist-list">
                        <div className="todolist-listcategory">
                            <div className="todolist-category-text">
                                {categorySelected}
                            </div>
                            <ExitToAppIcon onClick={() => removeCookie('token')} />
                        </div>
                        <div className={(toEdit) ? "todolist-out" : ""}>
                            <div className="todolist-in">
                                {
                                    getCategorylist(categorySelected).map((item, i) => <Todo key={item["_id"]} numero={i} deleteFun={deleteTodo} updateFun={setEdit} updateTodo={setTodoEdit} todo={item} id={item["_id"]} checked={item["checked"]} setList={setList} title={item["name"]} category={item["category"]} description={item["description"]} />)
                                }
                            </div>
                            {
                                toEdit &&
                                <div className="todolist-edit-side">
                                    <ClearIcon onClick={() => setEdit(false)} />
                                    <form onSubmit={e => { e.preventDefault(); updateTodo() }}>
                                        <input
                                            name="name"
                                            placeholder="TASK"
                                            onChange={changeHandlerEdit}
                                            value={todoEdit.name}
                                        >
                                        </input>
                                        <textarea
                                            placeholder="DESCRIPTION"
                                            name="description"
                                            onChange={changeHandlerEdit}
                                            value={todoEdit.description}
                                            rows={5}
                                        >
                                        </textarea>
                                        <input type="submit" style={{ display: 'none' }}>
                                        </input>
                                        <button type="submit">
                                            UPDATE
                                        </button>
                                    </form>
                                </div>
                            }
                        </div>

                        <div className="todolist-edit-out">
                            <form className="todolist-edit" onSubmit={e => { createTodo(); e.preventDefault(); }}>
                                <div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="TASK"
                                        value={todo.name}
                                        onChange={changeHandlerTodo}
                                    ></input>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="description"
                                        value={todo.description}
                                        placeholder="SMALL DESCRIPTION"
                                        onChange={changeHandlerTodo}
                                    ></input>
                                </div>
                                <input type="submit" style={{ display: 'none' }}>
                                </input>
                                <AddCircleIcon onClick={createTodo} type="submit" />
                            </form>
                        </div>
                    </div>
                </div>
            }
            {
                !loading &&
                <div className="loading-wrapper">
                    <div>
                        <CircularProgress className="loading-circle" />
                    </div>
                    <div>
                        LOADING
                    </div>
                </div>
            }
        </div>

    );
}