import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { AiFillDelete } from "react-icons/ai";

const ToDoList = () => {
    const [todos, setTodos] = useState([]); // this is the state variable, which is an array of objects,
    // each object is a todo item with a title and a description property and a completed property set to false by default.
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    // database istance
    const db = firestore;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // this three are the useEffect hooks, which are used to perform side effects in React.
        // const db = firestore; // we do this to get a reference to the database, it's needed for the collection
        const collectionRef = collection(db, "todos"); // we do this to get a reference to the collection in the database
        const queryRef = query(collectionRef, orderBy("id", "desc"));

        setLoading(true);

        // Subscribe to realtime updates
        // this is the onSnapshot hook, which is used to subscribe to realtime updates in the database
        // we pass it the reference to the collection and a callback function that is called whenever a change is made to the collection
        // the callback function takes in the snapshot of the collection as an argument and returns an array of objects with the changes made

        /* const unsubscribe = onSnapshot(queryRef, (snapshot) => {
            const newTodos = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })); */

        const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
            let todosArr = [];
            querySnapshot.forEach((doc) => {
                todosArr.push({...doc.data(), id: doc.id});
            })
            setTodos(todosArr);
        });
        setLoading(false);
        return () => unsubscribe();
        
        // Clean up the listener when the component unmounts
    },[]); // why do we use [] here? because we don't want to perform any side effects when the component is unmounted, edit:taken out because eslinnt

    const handleAddTodo = async () => {

        setLoading(true); // we set the loading state to true, which is used to show a loading indicator

        // Create a new entry in the Firestore collection from the input fields
        // first we open conection to the database
        // const db = firestore;
        // then we create a reference to the collection
        const collectionRef = collection(db, "todos");
        // Get the curernt timestamo
        const timestamp = new Date();

        try {

            // then we add a new entry to the collection
            const docRef = await addDoc(collectionRef, {
                id: timestamp,
                title: title.trim(),
                description: description.trim(),
                completed: false,
            })

            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.log("Error adding document: ", error);
        }

        // we clear the input fields
        setTitle("");
        setDescription("");

        setLoading(false);
    }

    const updateCheck = async (id) => {
        // Find the todo to update based on the id parameter
        const todoToUpdate = todos.find((todo) => todo.id === id);
      
        // If the todo is found
        if (todoToUpdate) {
          // Create a new object with the updated completed property
          const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };
      
          // Get a reference to the document in Firestore
          const docRef = doc(db, "todos", id);
      
          // Update only the completed field of the document in Firestore with the new value of completed
          await updateDoc(docRef, { completed: updatedTodo.completed });
      
          // Update the todos array in your React component with the new value of completed
          setTodos((prevTodos) =>
            prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
          );
        }
      };

    const deleteTodo = async (id) => {
        // Find the todo to delete based on the id parameter
        const todoToDelete = todos.find((todo) => todo.id === id);

        // If the todo is found
        if (todoToDelete) {
            // Get a reference to the document in Firestore
            const docRef = doc(db, "todos", id);

            // Delete the document
            await deleteDoc(docRef);

            // Update the todos array in your React component
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        }
    }

    // now we render the todo list
    return (
        <div>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />

            <button onClick={handleAddTodo}>Add Todo</button>

            {todos.map((todo) => (
                <div style={{ display: "flex", flexDirection: "row", gap: "50px" }} key={todo.id}>
                    <h2>{todo.title}</h2>
                    <p>{todo.description}</p>
                    <input title="Completed?" type="checkbox" checked={todo.completed} onChange={() => updateCheck(todo.id)} />
                    <button title="Delete" onClick={() => deleteTodo(todo.id)}>{<AiFillDelete />}</button>
                </div>
            ))}

            {loading && <p>Loading...</p>}
        </div>

    )
}

export default ToDoList;