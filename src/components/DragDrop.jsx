import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useSelector } from 'react-redux';

export const DragDrop = () => {
    const tasks = useSelector((store) => store?.setlistSlice?.data);
    const { onDragEnd } = useFirebaseData();

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-6 bg-slate-300 p-4">
                {Object.keys(tasks).map(columnId => (
                    <Droppable key={columnId} droppableId={columnId}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="bg-gray-100 p-4 rounded-lg shadow-lg w-72"
                            >
                                <h2 className="font-bold text-xl text-gray-700 mb-4 text-center">
                                    {columnId === 'todo' ? 'Tareas' : columnId === 'inProgress' ? 'En Progreso' : 'Realizado'}
                                </h2>
                                {tasks[columnId].map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-white p-4 rounded-lg shadow mb-4 cursor-pointer hover:bg-gray-50 transition"
                                            >
                                                <div className="font-semibold text-gray-800">{task.title}</div>
                                                <div className="text-gray-600">{task.description}</div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};
