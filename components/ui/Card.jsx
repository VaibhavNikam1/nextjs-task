import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import React, { useState } from "react";

function Card()
{

    const [title,setTitle] = useState(null)
    async function handleSubmit()
    {
        const {data,error} = await Supabase.form("post").insert(
            [{title: title}]
        );
    }
    return(
        <div>
            <form action="" onSubmit={e => handleSubmit(e)}>
                <input type="text" name="title" id="title" value={title} onChange={e => setTitle(e.target.value)} />
                <button type="submit">submit</button>
            </form>
        
        </div>
    )
}

export default Card