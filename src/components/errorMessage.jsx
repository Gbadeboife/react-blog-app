import React from "react";




function ErrorMessage({errMessage}){
    return(
        <>
        {
            errMessage?
            (<p className="err-msg">{errMessage}</p>)
            :
            null 

        }
        </>
    )

}

export default ErrorMessage