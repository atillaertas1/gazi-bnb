import { useEffect } from "react";
import EmptyState from "./EmptyState";

const Error = (error) => {
    useEffect(() => {
        console.error(error);
    }, [error]); 

    return (
        <EmptyState title="Uh oh" subtitle="Something went wrong!"/>
    )
}

export default Error; 