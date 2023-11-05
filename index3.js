

const tokens = [
    { type: 'else', regex: /^else/ },
    { type: 'tipo', regex: /^(int|boolean|string|if|func|for)/ },
    { type: 'boolean', regex: /^(true|false)+/ },
    { type: 'if', regex: /^[a-zA-Z_]+([a-zA-Z0-9_]*)((==|<=|>=|!|<|>){1})[a-zA-Z_]+([a-zA-Z0-9_]*)/ },
    { type: 'IDENTIFICADOR', regex: /^[a-zA-Z_]([a-zA-Z0-9_]*)/ },
    { type: 'int', regex: /^(([1-9][0-9]*)|0)/},
    { type: 'string', regex: /^"([\s"a-zA-Z0-9][a-zA-Z0-9_]*)*"/ },
    { type: 'boolean', regex: /^(true|false)+/ },
    { type: 'func', regex: /^function/ },
    { type: '(', regex: /^\(/ },
    { type: ')', regex: /^\)/ },
    { type: '{', regex: /^\{/ },
    { type: '}', regex: /^\}/ },
    { type: 'for', regex: /^for/ },
    { type: ',', regex: /^,/ },
    { type: ';', regex: /^;/ },
    { type: '+', regex: /^\+/ },
    { type: '-', regex: /^-/ },
    { type: '*', regex: /^\*/ },
    { type: '/', regex: /^\// },
    { type: '<=', regex: /^<=/ },
    { type: '>=', regex: /^>=/ },
    { type: '>', regex: /^>/ },
    { type: '<', regex: /^</ },
    { type: '=', regex: /^=/ },
];


function tokenize(sourceCode) {
    const tokenizedCode = [];
    let match;
    
    while (sourceCode) {
        let foundMatch = false;

        for (const { type, regex } of tokens) {
            match = sourceCode.match(regex);
            
            
            if (match && match.index === 0) {
                const value = match[0];
                tokenizedCode.push({ type, value });
                sourceCode = sourceCode.slice(value.length).trim();
                console.log(tokenizedCode)
                foundMatch = true;
                break;
            }
        }

        if (!foundMatch) {
            throw new Error('Error de tokenización: No se pudo analizar el código fuente');
        }
    }
    
    return tokenizedCode;
}

let currentTokenIndex = 0;
let conditional = false;
let elseif = false;
let func = false;
let cicle = false;
function parseProgram(tokens1) {
    
    function consume(type) {
        console.log(tokens1)
        const token = tokens1[currentTokenIndex];

        if (token && token.type == type) {
            const value = token.value;
            currentTokenIndex++;
            return value;
        } else {
            if(type==="if"||type==="string"||type==="int"||type==="func"||type==="boolean"||type==="else") {
                let currentTokenIndexRep = currentTokenIndex;
                currentTokenIndex = 0;
                throw new Error(`Error de sintaxis: Se esperaba un token de tipo expresión ${type} después de ${tokens1[currentTokenIndexRep-1].value}`);
                process.exit(1);
            }
            let currentTokenIndexRep = currentTokenIndex;
            currentTokenIndex = 0;
            throw new Error(`Error de sintaxis: Se esperaba un token de tipo ${type} después de ${tokens1[currentTokenIndexRep-1].value}`);
        }
    }

    function parseDeclarationVariable() {
        
        const type = consume('tipo');
        consume('IDENTIFICADOR');
        console.log(type);
        consume('=');
        parseExpresion(type);
        consume(';');
    }

    function parseExpresion(type){
        consume(type);
    }

    function parseFunction() {
        const type = consume('tipo');
        consume('string');
        consume('(');
        parseParametros();
        consume(')');
        consume('{');
        parseProgram();
        consume('}');
    }

    function parseParametros() {
        while (tokens[currentTokenIndex].type === 'tipo') {
            consume('tipo');
            consume('IDENTIFICADOR');
            if (tokens[currentTokenIndex].type !== ',') {
                break;
            }
            consume(',');
        }
    }

    function parseConditional() {
        conditional = true;
        const type = consume('tipo');
        consume('(');
        parseExpresion('if');
        //consume('IDENTIFICADOR')
        consume(')');
        consume('{');
        parseProgram(tokens1);
        consume('}');
        console.log(tokens1[currentTokenIndex]);
        if (tokens1[currentTokenIndex]!=undefined && tokens1[currentTokenIndex].value =='else') {
            elseif = true;
            console.log("entra")
            consume('else');
            consume('{');
            parseProgram(tokens1);
            consume('}');
        }
        conditional = false;
        elseif = false;
    }

    function parseCicloFor() {
        consume('for');
        consume('(');
        parseInicializacion();
        consume(';');
        parseCondicion();
        consume(';');
        parseActualizacion();
        consume(')');
        consume('{');
        parseProgram();
        consume('}');
    }


    while (currentTokenIndex < tokens1.length) {
        if (tokens1[currentTokenIndex].value === 'int' || tokens1[currentTokenIndex].value === 'string' || tokens1[currentTokenIndex].value === 'boolean') {
            parseDeclarationVariable();
        } else if (tokens1[currentTokenIndex].value === 'func') {
            parseFunction();
        } else if (tokens1[currentTokenIndex].value === 'if') {
            console.log(tokens1[currentTokenIndex].value);
            parseConditional();
        } else if (tokens1[currentTokenIndex].value === 'for') {
            parseCicloFor();
        } else if (tokens1[currentTokenIndex].value === '}'){
            break;
        } else if (tokens1[tokens1.length-1].value === 'else' && conditional ==true){
            break;
        }
        else {
            throw new Error('Error de sintaxis: Estructura no reconocida, pruebe con string,int,boolean,func,if,for...');
        }
    }
}

function validateString() {
    currentTokenIndex = 0;
    const cadena = document.getElementById('variable').value;
    const tokens1 = tokenize(cadena);
    console.log(tokens1);
    parseProgram(tokens1);
    console.log("El código es sintácticamente válido.");
    
}

