import React from 'react';
import { db, collection, onSnapshot, doc, setDoc, updateDoc, arrayUnion,getDoc} from '../Firebase/firebaseConfig';
import { useSelector, useDispatch } from 'react-redux';
import { setlistSlice } from '../redux/store/listSlice';

export const useFirebaseData = () => {
    const tasks = useSelector((store) => store?.setlistSlice?.data);
    const dispatch = useDispatch();

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'data'), (snapshot) => {
            const tasksData = snapshot.docs.reduce((acc, doc) => {
                const data = doc.data();
                console.log(data);
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

        const updatedTask = {
            ...movedTask,
            status: destination.droppableId,
        };

        destColumn.splice(destination.index, 0, updatedTask);

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
            const documentId = 'ElZ6qoBnDKFBnzcYtkBZ';
            await setDoc(doc(db, 'data', documentId), tasksData, { merge: true });
        } catch (error) {
            console.error('Error updating Firestore:', error);
        }
    };

    const createNewTodo = async (newTask) => {
        try {
            const documentId = 'ElZ6qoBnDKFBnzcYtkBZ'; 
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
                    id: `list${totalList + 1}`, // Generar un nuevo ID basado en el conteo
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

    return {
        onDragEnd,
        createNewTodo
    };
};
