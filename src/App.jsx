import React from 'react';
import { DragDrop } from './components/DragDrop';
import expediente from './assets/images/expediente.png'
import { ModalNewTodo } from './components/ModalNewTodo';

export const App = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="min-h-screen bg-slate-300 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1 flex justify-center">
          <h1 className="text-7xl font-bold text-white">Lista de tareas</h1>
        </div>
        <button className=" text-white px-4 py-2 rounded hover:bg-blue-600 transition" onClick={()=>setOpen(true)}>
          <img src={expediente} alt="" width={50} />
        </button>
      </div>
      <div className="flex justify-center items-center">
        <DragDrop />
      </div>
      <ModalNewTodo
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};
