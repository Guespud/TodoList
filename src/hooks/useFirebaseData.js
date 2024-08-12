import React from 'react';
import { db, collection, onSnapshot, doc, setDoc, updateDoc, arrayUnion, getDoc, arrayRemove } from '../Firebase/firebaseConfig';
import { useSelector, useDispatch } from 'react-redux';
import { setlistSlice } from '../redux/store/listSlice';
import { VALUE_KEY_BD } from '../config/const';

export const useFirebaseData = () => {
    const tasks = useSelector((store) => store?.setlistSlice?.data);
    const dispatch = useDispatch();

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'data'), (snapshot) => {
            const tasksData = snapshot.docs.reduce((acc, doc) => {
                const data = doc.data();
                acc.todo = data.todo || [];
                acc.inProgress = data.inProgress || [];
                acc.done = data.done || [];
                return acc;
            }, {});
            dispatch(setlistSlice(tasksData));
        });

        return () => unsubscribe();
    }, [dispatch]);

    const onDragEnd = async (result) => {
        const { source, destination } = result;

        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
            return;
        }

        const sourceColumn = Array.from(tasks[source.droppableId]);
        const destColumn = Array.from(tasks[destination.droppableId]);

        const [movedTask] = sourceColumn.splice(source.index, 1);

        if (!destColumn.some(task => task.id === movedTask.id)) {
            destColumn.splice(destination.index, 0, movedTask);
        }

        const updatedTasks = {
            ...tasks,
            [source.droppableId]: sourceColumn,
            [destination.droppableId]: destColumn,
        };

        dispatch(setlistSlice(updatedTasks));

        await updateFirestoreCollection({
            todo: updatedTasks.todo,
            inProgress: updatedTasks.inProgress,
            done: updatedTasks.done,
        });
    };

    const updateFirestoreCollection = async (tasksData) => {
        try {
            const documentId = VALUE_KEY_BD;
            await setDoc(doc(db, 'data', documentId), tasksData, { merge: true });
        } catch (error) {
            console.error('Error updating Firestore:', error);
        }
    };

    const createNewTodo = async (newTask) => {
        try {
            const documentId = VALUE_KEY_BD;
            const dataDocRef = doc(db, 'data', documentId);
            const docSnap = await getDoc(dataDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const todoCount = data.todo ? data.todo.length : 0;
                const inProgressCount = data.inProgress ? data.inProgress.length : 0;
                const doneCount = data.done ? data.done.length : 0;
                const totalList = todoCount + inProgressCount + doneCount;

                let newTodo = {
                    ...newTask,
                    id: `list${totalList + 1}`,
                    status: "todo"
                };

                await updateDoc(dataDocRef, {
                    todo: arrayUnion(newTodo)
                });
                console.log('Nueva tarea añadida a todo exitosamente!');
            } else {
                console.log('No existe el documento en Firestore.');
            }
        } catch (error) {
            console.error('Error al añadir la tarea:', error);
        }
    };

    const deleteTodo = async (data) => {
        try {
            const documentId = VALUE_KEY_BD;
            const dataDocRef = doc(db, 'data', documentId);
            const docSnap = await getDoc(dataDocRef);

            if (docSnap.exists()) {
                const currentTasks = docSnap.data();
                const states = ['todo', 'inProgress', 'done'];

                let taskFound = false;

                for (const state of states) {
                    const tasks = currentTasks[state] || [];

                    const taskToDelete = tasks.find(task => task.id === data.id);

                    if (taskToDelete) {
                        await updateDoc(dataDocRef, {
                            [state]: arrayRemove(taskToDelete)
                        });
                        taskFound = true;
                        break;
                    }
                }
                if (!taskFound) {
                    console.error('Tarea no encontrada en ninguna lista.');
                }
            } else {
                console.error('Documento no encontrado en Firestore.');
            }
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    };


    return {
        onDragEnd,
        createNewTodo,
        deleteTodo
    };
};
