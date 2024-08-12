import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useSelector } from 'react-redux';
import Delete from '../assets/images/delete.png';

export const DragDrop = () => {
    const tasks = useSelector((store) => store?.setlistSlice?.data);
    const { onDragEnd, deleteTodo } = useFirebaseData();

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row md:space-x-6 bg-slate-300 p-4 space-y-6 md:space-y-0">
                {Object.keys(tasks).map(columnId => (
                    <Droppable key={columnId} droppableId={columnId}>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="bg-gray-100 p-4 rounded-lg shadow-lg w-full md:w-72"
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
                                                className="bg-white p-4 rounded-lg shadow mb-4 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between w-full"
                                            >
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="font-semibold text-gray-800 truncate">
                                                        {task.title}
                                                    </div>
                                                    <div className="text-gray-600 mt-1 truncate">
                                                        {task.description}
                                                    </div>
                                                </div>
                                                <button
                                                    className="text-red-600 bg-transparent border-none cursor-pointer hover:text-red-800"
                                                    onClick={() => deleteTodo(task)}
                                                >
                                                    <img src={Delete} width={30} alt="Eliminar" />
                                                </button>
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
