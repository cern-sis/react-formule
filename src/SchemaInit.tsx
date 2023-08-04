import { useEffect } from "react"

const SchemaInit = ({children, schemaInit}) => {
    useEffect(() => {
        schemaInit()
    }, [])

    return children
}

export default SchemaInit