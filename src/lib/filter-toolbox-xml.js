const normalize = value => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const variableBlockTypes = [
    'data_variable',
    'data_setvariableto',
    'data_changevariableby',
    'data_showvariable',
    'data_hidevariable'
];

const listBlockTypes = [
    'data_listcontents',
    'data_addtolist',
    'data_deleteoflist',
    'data_deletealloflist',
    'data_insertatlist',
    'data_replaceitemoflist',
    'data_itemoflist',
    'data_itemnumoflist',
    'data_lengthoflist',
    'data_listcontainsitem',
    'data_showlist',
    'data_hidelist'
];

const blockKeywords = {
    motion_movesteps: ['move', 'moves', 'step', 'steps', 'mover', 'mueve', 'paso', 'pasos', 'avanzar'],
    motion_turnright: ['turn', 'right', 'girar', 'derecha'],
    motion_turnleft: ['turn', 'left', 'girar', 'izquierda'],
    motion_goto: ['go to', 'goto', 'ir a', 'mover a'],
    motion_gotoxy: ['go to', 'goto', 'position', 'ir a', 'posicion'],
    motion_glidesecstoxy: ['glide', 'glide to', 'deslizar', 'deslizar a'],
    motion_changexby: ['change x', 'move x', 'cambiar x', 'mover x'],
    motion_setx: ['set x', 'set position', 'establecer x', 'fijar x'],
    motion_changeyby: ['change y', 'move y', 'cambiar y', 'mover y'],
    motion_sety: ['set y', 'set position', 'establecer y', 'fijar y'],
    looks_say: ['say', 'speak', 'decir', 'hablar'],
    looks_sayforsecs: ['say', 'speak', 'decir', 'hablar'],
    looks_think: ['think', 'pensar'],
    looks_thinkforsecs: ['think', 'pensar'],
    looks_show: ['show', 'mostrar', 'aparecer'],
    looks_hide: ['hide', 'ocultar', 'esconder'],
    looks_changesizeby: ['change size', 'resize', 'cambiar tamaño'],
    looks_setsizeto: ['set size', 'resize', 'establecer tamaño', 'fijar tamaño'],
    looks_switchcostumeto: ['costume', 'disfraz'],
    control_wait: ['wait', 'pause', 'esperar', 'pausar'],
    control_repeat: ['repeat', 'loop', 'repetir', 'veces'],
    control_forever: ['forever', 'always', 'por siempre', 'siempre'],
    control_if: ['if', 'condition', 'si', 'condicion'],
    control_if_else: ['if', 'else', 'condition', 'si', 'si no', 'condicion'],
    control_wait_until: ['wait until', 'esperar hasta'],
    control_repeat_until: ['repeat until', 'until', 'repetir hasta'],
    sensing_askandwait: ['ask', 'question', 'preguntar', 'pregunta'],
    sensing_touchingobject: ['touching', 'colliding', 'tocando', 'colision'],
    sensing_keypressed: ['key pressed', 'tecla', 'presionada'],
    operator_add: ['add', 'addition', 'plus', 'sumar', 'suma', 'mas'],
    operator_subtract: ['subtract', 'minus', 'restar', 'resta', 'menos'],
    operator_multiply: ['multiply', 'times', 'multiplicar', 'multiplicacion'],
    operator_divide: ['divide', 'division', 'dividir'],
    operator_equals: ['equals', 'equal', 'same', 'igual', 'iguales'],
    operator_gt: ['greater', 'greater than', 'mayor', 'mayor que'],
    operator_lt: ['less', 'less than', 'menor', 'menor que'],
    operator_and: ['and', 'y'],
    operator_or: ['or', 'o'],
    operator_not: ['not', 'no'],
    data_variable: ['variable', 'value', 'valor'],
    data_setvariableto: ['set variable', 'set value', 'establecer variable', 'fijar variable'],
    data_changevariableby: ['change variable', 'increase variable', 'cambiar variable', 'aumentar variable'],
    data_listcontents: ['list', 'lista'],
    data_addtolist: ['add to list', 'append', 'añadir a lista', 'agregar a lista'],
    data_deleteoflist: ['delete from list', 'remove from list', 'borrar de lista', 'eliminar de lista'],
    data_deletealloflist: ['clear list', 'empty list', 'vaciar lista', 'borrar lista'],
    data_itemoflist: ['item of list', 'elemento de lista'],
    data_lengthoflist: ['list length', 'length of list', 'longitud de lista', 'tamaño de lista']
};

const addVariableBlock = (document, category, type, variable, fieldName) => {
    const block = document.createElement('block');
    block.setAttribute('type', type);

    const field = document.createElement('field');
    field.setAttribute('name', fieldName);
    field.setAttribute('id', variable.id);
    field.setAttribute('variabletype', variable.type || '');
    field.textContent = variable.name;
    block.appendChild(field);
    category.appendChild(block);
};

const filterToolboxXML = (toolboxXML, query, variables, noResultsMessage) => {
    const normalizedQuery = normalize(query);
    const sourceDocument = new DOMParser().parseFromString(toolboxXML, 'text/xml');
    if (sourceDocument.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Unable to parse the block toolbox XML for search.');
    }

    const resultsCategory = sourceDocument.createElement('category');
    resultsCategory.setAttribute('name', 'Search');
    resultsCategory.setAttribute('id', 'searchResults');
    resultsCategory.setAttribute('colour', '#4C97FF');
    sourceDocument.documentElement.insertBefore(
        resultsCategory,
        sourceDocument.documentElement.firstElementChild
    );

    if (normalizedQuery) {
        const categories = Array.from(sourceDocument.getElementsByTagName('category'));
        categories.forEach(category => {
            const categoryName = category.getAttribute('name');
            Array.from(category.children)
                .filter(child => child.tagName === 'block')
                .forEach(block => {
                    const type = block.getAttribute('type') || '';
                    const searchableText = `${categoryName} ${type} ${block.textContent}`;
                    const keywordMatch = (blockKeywords[type] || [])
                        .some(keyword => normalize(keyword).includes(normalizedQuery));
                    if (normalize(searchableText).includes(normalizedQuery) || keywordMatch) {
                        resultsCategory.appendChild(sourceDocument.importNode(block, true));
                    }
                });
        });

        const seenVariables = new Set();
        variables.forEach(variable => {
            if (seenVariables.has(variable.id)) return;
            seenVariables.add(variable.id);

            const isList = variable.type === 'list';
            if (!isList && variable.type) return;
            const blockTypes = isList ? listBlockTypes : variableBlockTypes;
            const categoryName = isList ? 'lists list' : 'variables variable';
            const searchableText = `${categoryName} ${variable.name} ${variable.id} ${blockTypes.join(' ')}`;
            if (!normalize(searchableText).includes(normalizedQuery)) return;

            blockTypes.forEach(type => {
                addVariableBlock(
                    sourceDocument,
                    resultsCategory,
                    type,
                    variable,
                    isList ? 'LIST' : 'VARIABLE'
                );
            });
        });
    }

    if (!resultsCategory.children.length) {
        const label = sourceDocument.createElement('label');
        label.setAttribute('text', noResultsMessage);
        resultsCategory.appendChild(label);
    }

    return sourceDocument.documentElement.outerHTML;
};

export default filterToolboxXML;
