'use server'

export async function Insert(data) {

    const args = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': process.env.API_KEY
        },
        body: JSON.stringify(data)
    };

    const url = process.env.API_URL + "/author";

    let reply = {
        success: undefined,
        message: ''
    };

    await fetch(url, args).then((result) => {
        result.json().then((resultData) => {
            if (result.status == 200) {
                //ações em caso de sucesso
                reply.success = true;
                reply.message = "salvo com sucesso";
            }
            else {
                //ações em caso de erro
                let errorMessage = '';
                if (resultData.errors != null) {
                    const totalErros = Object.keys(resultData.errors).length;

                    for (let i = 0; i < totalErros; i++) {
                        errorMessage = errorMessage + Object.values(resultData.errors)[i];
                    }
                }
                else
                    errorMessage = resultData;

                reply.status = false;
                reply.message = errorMessage;
            }
        }).catch(() => {
            //erro na conversão para Json
            reply.status = false;
            reply.message = 'Dados inválidos';
        })
    }).catch((ex) => {
        //erro geral
        reply.status = false;
        reply.message = ex.message;
    });

    return reply;
}

export async function List() {
    const args = {
        method: 'GET',
        headers: {
            'x-api-key': process.env.API_KEY
        }
    };

    const url = process.env.API_URL + "/author";

    let reply = {
        success: undefined,
        message: '',
        data: null
    };

    await fetch(url, args).then((result) => {
        result.json().then((resultData) => {
            if (result.status == 200) {
                //ações em caso de sucesso
                reply.success = true;
                reply.data = resultData;
            }
            else {
                //ações em caso de erro
                let errorMessage = '';
                if (resultData.errors != null) {
                    const totalErros = Object.keys(resultData.errors).length;

                    for (let i = 0; i < totalErros; i++) {
                        errorMessage = errorMessage + Object.values(resultData.errors)[i];
                    }
                }
                else
                    errorMessage = resultData;

                reply.status = false;
                reply.message = errorMessage;
            }
        }).catch(() => {
            //erro na conversão para Json
            reply.status = false;
            reply.message = 'Dados inválidos';
        })
    }).catch((ex) => {
        //erro geral
        reply.status = false;
        reply.message = ex.message;
    });

    return reply;
}