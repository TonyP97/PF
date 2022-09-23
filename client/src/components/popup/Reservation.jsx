import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createReservation, getReservations, getTable } from '../../redux/actions/index';
import { useEffect } from "react";
import { useState } from "react";
import {loadStripe} from "@stripe/stripe-js"
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import axios from 'axios';
import swal from "sweetalert";
import PruebaPago from "../pruebapago";


const validationForm = (input) => {
    let errors = {};

    if (!input.date) {
        errors.date = "Date required"
    }
    if (!input.hour) {
        errors.hour = "Hour is required"
    }
    if (!input.num_Table) {
        errors.num_Table = "SELECT A TABLE PLEASE"
    }
    if (input.num_Table > 1) {
        errors.num_Table = "SELECT ONLY ONE TABLE PLEASE"
    }
    return errors
};

// console.log(PruebaPago().props)

const Reservation = (props) => {
    const dispatch = useDispatch();
    const tables = useSelector((state) => state.tables);
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState({
        date: "",
        hour: "",
        price: 300,
        num_Table: [],
    })
    const [errors, setErrors] = useState({});
    useEffect(() => {
        dispatch(getTable())
        //dispatch(createReservation())
        dispatch(getReservations())
    }, [dispatch])
    function handleSubmit() {
        // e.preventDefault();
        setErrors(validationForm(input))
        const errors = validationForm(input)
        console.log(errors);
        if (Object.values(errors).length) {
            swal({
                title: "Por favor complete los campos a llenar",
                icon: "warning",
                buttons: "aceptar",
            })
        } else {
            {
                dispatch(createReservation(input));
                // swal("reservation confirmed, we are waiting for you soon", {
                //     icon: "success",
                // });
            }
            
        }
        
    }

    function nexttt()  {
        setOpen(true)
    }

    function handleChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
        setErrors(validationForm({
            ...input,
            [e.target.name]: e.target.name
        })
        )
    }
    return (
        <Transition.Root show={true} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={props.setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            enterTo="opacity-100 translate-y-0 md:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 md:scale-100"
                            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                        >
                            <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                                {/* <form onSubmit={(e) => handleSubmit(e)}> */}
                                <div className="relative flex w-full items-center overflow-hidden bg-white rounded-lg">
                                    <div className="flex w-full items-center justify-center">

                                        <div className="mx-auto w-full bg-white">

                                            <div
                                                className="flex w-full items-center justify-between py-4 px-9 border-b border-gray-200"
                                            >
                                                <h3 className="text-xl font-bold text-red-700">¿Desea reservar?</h3>
                                                <button onClick={() => props.setOpen(false)} className="text-gray-400 hover:text-gray-500">
                                                    <XMarkIcon className="h-8 w-8" aria-hidden="true" />
                                                </button>
                                            </div>
                                                {
                                                    open && <PruebaPago open={open} setOpen={setOpen}/> 
                                                }
                                                {
                                                    
                                                }
                                            <div
                                                className="px-4 pt-8 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8"
                                            >

                                                <div className="-mx-3 flex flex-wrap">
                                                    <div className="w-full px-3 sm:w-1/2">
                                                        <div className="mb-5">
                                                            <label
                                                                htmlFor="date"
                                                                className="mb-3 block text-base font-medium text-[#07074D]"
                                                            >
                                                                Fecha
                                                            </label>
                                                            <input

                                                                type="date"
                                                                name="date"
                                                                id="date"
                                                                min="2022-09-21"
                                                                max="2025-04-30"
                                                                value={input.date}
                                                                onChange={handleChange}
                                                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                                            /> {errors.date && <p className='form-error'>{errors.date}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="w-full px-3 sm:w-1/2">
                                                        <div className="mb-5">
                                                            <label
                                                                htmlFor="time"
                                                                className="mb-3 block text-base font-medium text-[#07074D]"
                                                            >
                                                                Hora
                                                            </label>
                                                            <input
                                                                type="time"
                                                                step="3600000"
                                                                name="hour"
                                                                id="hour"
                                                                value={input.hour}
                                                                onChange={handleChange}
                                                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                                            /> {errors.hour && <p className='form-error'>{errors.hour}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="-mx-3 flex flex-wrap">
                                                    <div className="w-full px-3 sm:w-1/2">
                                                        <div className="mb-5">
                                                            <label
                                                                htmlFor="guest"
                                                                className="mb-3 block text-base font-medium text-[#07074D]"
                                                            >
                                                                Asientos
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="guest"
                                                                id="guest"
                                                                placeholder="2"
                                                                min="2"
                                                                max="4"
                                                                onChange={handleChange}
                                                                className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-full px-3 sm:w-1/2">
                                                        <div className="mb-5">
                                                            <label
                                                                htmlFor="table"
                                                                className="mb-3 block text-base font-medium text-[#07074D]"
                                                            >
                                                                Mesas (Disponibles)
                                                            </label>
                                                            <select
                                                                id="table"
                                                                onChange={handleChange}
                                                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                                            >
                                                                {
                                                                    tables.length ?
                                                                        tables.map((table) => (
                                                                            <option key={`reservation-${table.num_Table}`} value={table.num_Table}>{`Mesa ${table.num_Table}`}</option>
                                                                        ))
                                                                        :
                                                                        <option value={0}>Intente Otro Horario</option>
                                                                }
                                                            </select> {errors.num_Table && <p className='form-error'>{errors.num_Table}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button
                                                        className="hover:shadow-form w-full rounded-md bg-red-700 hover:bg-red-900 py-3 px-8 text-center text-base font-semibold text-white outline-none"
                                                        type='submit'
                                                        // onClick={() => handleSubmit()}
                                                        onClick={() => nexttt()}
                                                    >
                                                        Reservar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* </form> */}


                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}


export default Reservation;