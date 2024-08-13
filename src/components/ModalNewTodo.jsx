/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useFirebaseData } from "../hooks/useFirebaseData";

export const ModalNewTodo = ({ open, setOpen }) => {

    const { register, handleSubmit, reset, setValue } = useForm();
    const { createNewTodo, updateTodo, getTodoById } = useFirebaseData();

    const onSubmit = (data) => {
        if (open?.view == "edit") {
            updateTodo({ ...data, id: open?.id });
        } else {
            createNewTodo(data);
        }
        setOpen({ view: "", status: false });
        reset();
    }
    React.useEffect(() => {
        const fetchData = async () => {
            if (open?.view === "edit") {
                const dataEdit = await getTodoById(open?.id);
                if (dataEdit) {
                    setValue('title', dataEdit.title);
                    setValue('description', dataEdit.description);
                }
            } else {
                reset();
            }
        };
        fetchData();
    }, [open?.id]);


    return (
        <Dialog open={open?.status} onClose={() => setOpen({ ...open, status: false })} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-lg"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        {open?.view == "edit" ? "Editar Tarea" : "Nueva Tarea"}
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Titulo
                                                </label>
                                                <input
                                                    {...register("title", { required: "El titulo es obligatorio" })}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </div>
                                            <div className="mb-6">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Descripción
                                                </label>
                                                <input
                                                    {...register("description", { required: "La descripción es obligatoria" })}
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpen({ ...open, status: false })}
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto"
                                                >
                                                    Agregar
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
