const Case = ({ caso }) => {

    const { celula,
        comentarioGestion,
        date,
        ec,
        exa,
        fechaDeCarga,
        monitoreador,
        motivoConsulta,
        nombre,
        numeroCaso,
        om,
        origen,
        proceso,
        puntoATrabajar } = caso

    return (
        <li>
            <h3>{nombre}</h3>
            <p>{numeroCaso}</p>
            <p>{origen}</p>
            <p>{motivoConsulta}</p>
            <p>{puntoATrabajar}</p>
            <p>{proceso}</p>
            <p>{exa}</p>
            <p>{celula}</p>
            <p>{monitoreador}</p>
            <p>{comentarioGestion}</p>
            <p>{date}</p>
            <p>{fechaDeCarga}</p>
        </li>
    )
}

export default Case