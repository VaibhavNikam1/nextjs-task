'use client';

import { buttonVariants } from "@/components/ui/button";
// import { Table } from "@/components/ui/table";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import React, { useEffect } from 'react';

// import { mysupabase } from "../untils/supabase";


export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter();
    const [user, setUser] = useState(null)
    const [loding, setloding] = useState(true)
    const [tasks, setTasks] = useState([]);
    const [loginUserTasks, setloginUserTasks] = useState([]);
    const [title, setTitle] = useState('')
    // const [titleEdit, settitleEdit] = useState('')
    const [currentUserId, seUserId] = useState([])
    const supabase = createClientComponentClient();
    const supabaseUrl = 'https://jjkockkwydrfmganajln.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqa29ja2t3eWRyZm1nYW5hamxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0MTg2MDIsImV4cCI6MjAzMDk5NDYwMn0.PsH-ubcLRZ8Gwg6bTAE_m0EiUuDbCJTndn9J6m7gj80';
    const csupabase = createClient(supabaseUrl, supabaseKey);
    let i = 1;
    let i2 = 1;
    const [tasksEdit, setTasksEdit] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [titleEdit, settitleEdit] = useState('');
    // console.log(titleEdit);
    useEffect(() => {

        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setloding(false)
            seUserId(user.id)

        }
        getUser()


        async function fetchTasks() {
            try {
                const { data, error } = await csupabase
                    .from('task')
                    .select('*');
                if (error) {
                    throw error;
                }
                setTasks(data || []);
            } catch (error) {
                console.error('Error fetching tasks:', error.message);
            }
        }
        fetchTasks()


        // fetch login user task tasks 

        async function fetchUserById(userId) {
            // alert(userId)
            try {
                const { data, error } = await csupabase
                    .from('task')
                    .select('*')
                    .eq('user_id', userId);

                // console.log(data);

                if (data.length > 0) {
                    setloginUserTasks(data || []);
                } else {
                    console.log('User not found with ID:', userId);
                }

            } catch (error) {
                console.error('Error fetching user:', error.message);
            }
        }

        fetchUserById(currentUserId);


    }, [currentUserId])
    // console.log(currentUserId);

    const handleSignUp = async () => {
        const res = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`
            }
        })
        setUser(res.data.user)
        router.refresh();
        setEmail('')
        setPassword('')
    }

    const handleSignIn = async () => {
        const res = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        window.location.reload();
        setUser(res.data.user)
        // router.refresh();
        setEmail('')
        setPassword('')
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        // window.location.reload();
        setUser(null)
    }

    // console.log({loding,user})

    if (loding) {
        return (
            // <h1>Loding..</h1>

            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>)
    }



    // task store in supabase 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await csupabase
                .from('task')
                .insert([{ title, user_id: user.id }]);
            if (error) {
                throw error;
            }
            // console.log('Task created:', data);
            window.location.reload();
        } catch (error) {
            console.error('Error creating task:', error.message);
        }
    };


    async function handleDelete(id) {
        try {
            const { error } = await supabase
                .from('task')
                .delete()
                .eq('id', id);
            if (error) {
                throw error;
            }
            window.location.reload();
        } catch (error) {
            console.error('Error deleting record:', error.message);
        }
    }


    async function handleEdit(id) {
        try {
            const { data, error } = await csupabase
                .from('task')
                .select('*')
                .eq('id', id);

            if (error) {
                console.error('Error fetching data:', error.message);
                return;
            }

            if (data.length > 0) {
                setEditData(data[0]);
                console.log(data[0]);
                settitleEdit(data[0].title)
                setShowModal(true);

            } else {
                console.log('Task not found with ID:', id);
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    }
    function closeModal() {
        setShowModal(false);
        setEditData(null); 
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('task') 
                .update({ title: titleEdit })
                .match({ id: editData.id }); 

            if (error) {
                throw error;
            }
            window.location.reload();
            console.log('Task updated successfully:', data);
        } catch (error) {
            console.error('Error updating task:', error.message);
        }
    };

    console.log(tasksEdit);
    if (user) {
        return (
            // console.log(editData.title);


            <div className=" justify-center items-center bg-gray-800 ">
                <div className="bg-gray-900 p-8 shadow-md w-full top-0 flex justify-between">
                    <small className="text-xl font text-white dark:text-gray-300">
                        <strong>User Email:</strong> {user.email}

                    </small>
                    <button className={buttonVariants({ variant: "destructive" })} onClick={handleLogout}>Logout</button>
                </div>
                <div className="flex flex-row justify-between">
                    {showModal && (

                        <div className="modal absolute top-0 left-0 w-full h-full flex items-center justify-center">
                            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                            <div className="modal-container bg-black w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                <div className="modal-content py-4 text-left px-6">
                                    <div className="flex justify-between items-center pb-3">
                                        <h1 className="text-2xl font-bold text-white">Update Task</h1>
                                        <button className="modal-close" onClick={closeModal}>
                                            <svg className="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                <path
                                                    d="M18 1.4L16.6 0 9 7.6 1.4 0 0 1.4 7.6 9 0 16.6 1.4 18 9 10.4l7.6 7.6 1.4-1.4L10.4 9z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <form onSubmit={handleEditSubmit}>
                                        <div className="text-white flex justify-center pt-6">
                                        </div>
                                        <div className="p-10 ">
                                            <div className="mb-4">
                                                <label className="text-white block text-sm font-bold mb-2" htmlFor="title">
                                                    Task Name
                                                </label>
                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Enter Task Name" value={titleEdit} onChange={e => settitleEdit(e.target.value)} />
                                            </div>
                                            <div className="flex items-center justify-between"> 
                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="bg-white  p-8 border shadow-md w-full  ">
                        <form action="" className="w-full  bg-gray-600 rounded-lg " onSubmit={e => handleSubmit(e)}   >
                            <div className="text-white flex justify-center pt-6">
                                <h2>Create Task</h2>
                            </div>
                            <div className="p-10 ">
                                <div className="mb-4">
                                    <label className="text-white block text-sm font-bold mb-2" htmlFor="title">
                                        Task Name
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="Enter Task Name" value={title} onChange={e => setTitle(e.target.value)} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                        Submit
                                    </button>
                                </div>
                            </div>

                        </form>
                    </div>

                    <div className="bg-white h-screen p-3 border shadow-md w-full">
                        <div class="relative overflow-x-auto">
                            <div className="flex justify-center my-4">
                                <h1><strong>Your Tasks</strong></h1>
                            </div>
                            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" class="px-6 py-3">
                                            Sr No
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Taks Name
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Action
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {loginUserTasks.map(loginUserTasks => (
                                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            {/* <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{loginUserTasks.id} </th> */}
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{i++} </th>
                                            <td class="px-6 py-4">{loginUserTasks.title}</td>
                                            {/* <td class="px-6 py-4">{loginUserTasks.user_id}</td> */}
                                            <td>
                                                <button className={buttonVariants({ variant: "destructive" })} onClick={() => handleDelete(loginUserTasks.id)}>delete</button>
                                                <button className={buttonVariants({ variant: "default" })} onClick={() => handleEdit(loginUserTasks.id)}>Edit</button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white h-screen p-3 border shadow-md w-full">
                        <div class="relative overflow-x-auto">
                            <div className="flex justify-center my-4">
                                <h1><strong>All Team Members Tasks</strong></h1>
                            </div>
                            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" class="px-6 py-3">
                                            Sr No
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Taks Name
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            User ID
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map(tasks => (
                                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            {/* <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{tasks.id} </th> */}
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{i2++} </th>
                                            <td class="px-6 py-4">{tasks.title}</td>
                                            <td class="px-6 py-4">{tasks.user_id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        )



    }
    return (
        <main className="h-screen flex justify-center items-center bg-gray-800 p-6">
            <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96">
                <div className="flex justify-center my-3">
                    <p className="text-white text-w">Login</p>
                </div>
                <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 w-full p-3 rounded-md border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />

                <input
                    required
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 w-full p-3 rounded-md border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />

                {/* <button className="w-full mb-2 p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none" onClick={handleSignUp}>Sign Up</button> */}

                <button className="w-full p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none" onClick={handleSignIn}>Sign In</button>
            </div>
        </main>
    )

}
