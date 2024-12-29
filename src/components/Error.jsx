import { useEffect } from "react";
import EmptyState from "./EmptyState";

const Error = (error) => {
    useEffect(() => {
        console.error('Bir hata oluştu:', error);
    }, [error]); 

    return (
        <EmptyState title="Hata" subtitle="Bir şeyler ters gitti!"/>
    )
}

export default Error; 
