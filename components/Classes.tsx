import React from "react"

export default function Classes(props: any) {

    const {data} = props;

    return (
        <div >
            <div >
                {
                    data.classes.map(x => (
                        <div key={x.number} >
                            <h2 >{x.name}</h2>
                            <p >{x.number}</p>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}
