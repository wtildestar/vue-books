export default function FormattedDate(value){
    if(value instanceof Date)
        return value.toLocaleDateString()

    return value.toDate().toLocaleDateString()
}