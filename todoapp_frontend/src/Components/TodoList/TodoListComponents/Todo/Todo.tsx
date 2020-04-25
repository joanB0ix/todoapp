import * as React from 'react';
import './Todo.scss';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useCookies } from 'react-cookie';
import UIfx from 'uifx';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CreateIcon from '@material-ui/icons/Create';

export default function Todo(props: any) {

    const audio = require('../../../../media/dingsound.mp3');
    const trash = require('../../../../media/trash.mp3');

    const bell = new UIfx(
        audio, {
        volume: 0.5,
        throttleMs: 100
    }
    );

    const trashSound = new UIfx(
        trash, {
        volume: 0.2,
        throttleMs: 100
    }
    );

    const axios = require('axios');
    const [cookies,] = useCookies(['token']);
    const [icon, setIcon] = React.useState(true);

    function checkTarea() {
        setIcon(!icon);
        if (!icon)
            bell.play();
    }

    React.useEffect(() => {
        setIcon(props.checked);
    }, [])

    function deleteElement() {
        trashSound.play();
        props.deleteFun(props.id);
        axios.delete(process.env.REACT_APP_API + '/todos/delete/' + props.id, {
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            }
        });
    }

    function checkUncheck() {
        props.todo["checked"] = !icon;
        axios.put(process.env.REACT_APP_API + '/todos/update/' + props.id, props.todo, {
            headers: {
                'Authorization': `Bearer ${cookies.token}`
            }
        });
    }

    function edit(){
        props.updateFun(true);
        props.updateTodo({name: props.title, description: props.description, _id: props.id});
    }

    return (
        <div className="todo-wrapper">
            <div>
                <div onClick={checkTarea}>
                    {
                        !icon &&
                        <RadioButtonUncheckedIcon onClick={checkUncheck} />
                    }
                    {
                        icon &&
                        <CheckCircleOutlineIcon className="todo-check" onClick={checkUncheck} />
                    }
                </div>
            </div>
            {
                props.description &&
                <div className={"todo-info " + ((icon) ? "crossed" : "")}>
                    <div className="todo-title">
                        {props.title}
                    </div>
                    <div className="todo-description">
                        {props.description}
                    </div>
                </div>
            }{
                !props.description &&
                <div className={"todo-info-onlytitle "+ ((icon) ? "crossed" : "")}>
                    <div className="todo-title">
                        {props.title}
                    </div>
                </div>
            }
            <div className="todo-action-icons">
                <CreateIcon className="todo-trash" onClick={edit}/>
                <DeleteForeverIcon className="todo-trash" onClick={deleteElement} />
            </div>
        </div>
    )
}