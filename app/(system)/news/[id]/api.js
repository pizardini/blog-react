'use server'

export async function CommentsFromNews(id) {
    const args = {
        method: 'GET',
        headers: {
            'x-api-key': process.env.API_KEY
        },
        cache: 'no-store'
    };

    const url = process.env.API_URL + "/comment/news/" + id;
    console.log(url)
    let reply = {
        success: undefined,
        message: '',
        data: null,
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

export async function AddReaction(newsId, type, readerId) {
    const data = {
        newsId: newsId,
        type: type,
        readerId: readerId
    };
    
    const args = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.API_KEY
        },
        body: JSON.stringify(data) //não funcionou
    };

    const url = process.env.API_URL + '/reaction';
    let reply = {
        success: undefined,
        message: '',
        data: null,
    };

    await fetch(url, args).then((result) => {
        result.json().then((resultData) => {
            if (result.status == 200) {
                reply.success = true;
                reply.data = resultData;
            } else {
                let errorMessage = '';
                if (resultData.errors != null) {
                    const totalErros = Object.keys(resultData.errors).length;
                    for (let i = 0; i < totalErros; i++) {
                        errorMessage = errorMessage + Object.values(resultData.errors)[i];
                    }
                } else {
                    errorMessage = resultData;
                }
                reply.success = false;
                reply.message = errorMessage;
            }
        }).catch(() => {
            reply.success = false;
            reply.message = 'Dados inválidos';
        });
    }).catch((ex) => {
        reply.success = false;
        reply.message = ex.message;
    });

    return reply;
}

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

    const url = process.env.API_URL + "/reaction";

    let reply = {
        success: undefined,
        message: ''
    };

    await fetch(url, args).then((result) => {
        result.json().then((resultData) => {
            if (result.status == 200) {
                //ações em caso de sucesso
                reply.success = true;
                reply.message = "Reação salva com sucesso";
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
