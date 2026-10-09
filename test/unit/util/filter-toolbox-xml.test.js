import filterToolboxXML from '../../../src/lib/filter-toolbox-xml';

const toolboxXML = `
    <xml>
        <category name="Motion" id="motion">
            <block type="motion_movesteps">
                <value name="STEPS">
                    <shadow type="math_number">
                        <field name="NUM">10</field>
                    </shadow>
                </value>
            </block>
            <block type="motion_turnright"/>
        </category>
        <category name="Control" id="control">
            <block type="control_repeat"/>
        </category>
        <category name="Operators" id="operators">
            <block type="operator_and"/>
            <block type="operator_trueBoolean"/>
        </category>
    </xml>
`;

const getSearchResult = (query, variables = []) => {
    const result = filterToolboxXML(toolboxXML, query, variables, 'No blocks found');
    return new DOMParser().parseFromString(result, 'text/xml');
};

const getSearchCategory = result => result.querySelector('category[id="searchResults"]');

describe('filterToolboxXML', () => {
    test('matches block opcodes with dots, spaces, and partial names', () => {
        ['motion.movesteps', 'move', 'movesteps'].forEach(query => {
            const result = getSearchResult(query);
            const searchCategory = getSearchCategory(result);
            expect(searchCategory.querySelector('block[type="motion_movesteps"]')).not.toBeNull();
            expect(searchCategory.querySelector('block[type="motion_turnright"]')).toBeNull();
        });
    });

    test('matches English and Spanish block keywords', () => {
        ['move', 'mover', 'repeat', 'repetir'].forEach(query => {
            const result = getSearchResult(query);
            const expectedType = query === 'repeat' || query === 'repetir' ?
                'control_repeat' :
                'motion_movesteps';
            expect(getSearchCategory(result).querySelector(`block[type="${expectedType}"]`)).not.toBeNull();
        });
    });

    test('includes matching boolean and reporter blocks', () => {
        const result = getSearchResult('boolean');
        expect(getSearchCategory(result).querySelector('block[type="operator_trueBoolean"]')).not.toBeNull();
    });

    test('matches scalar variable names and creates draggable variable blocks', () => {
        const result = getSearchResult('posicion', [{
            id: 'variable-id',
            name: 'posición',
            type: ''
        }]);
        const searchCategory = getSearchCategory(result);
        const variableBlock = searchCategory.querySelector('block[type="data_variable"]');
        expect(variableBlock).not.toBeNull();
        expect(variableBlock.querySelector('field').getAttribute('id')).toBe('variable-id');
        expect(variableBlock.querySelector('field').textContent).toBe('posición');
        expect(searchCategory.querySelector('block[type="data_setvariableto"]')).not.toBeNull();
    });

    test('matches list names and creates list blocks', () => {
        const result = getSearchResult('my list', [{
            id: 'list-id',
            name: 'My list',
            type: 'list'
        }]);
        const searchCategory = getSearchCategory(result);
        const listBlock = searchCategory.querySelector('block[type="data_listcontents"]');
        expect(listBlock).not.toBeNull();
        expect(listBlock.querySelector('field').getAttribute('name')).toBe('LIST');
        expect(listBlock.querySelector('field').getAttribute('id')).toBe('list-id');
        expect(searchCategory.querySelector('block[type="data_addtolist"]')).not.toBeNull();
    });

    test('shows an empty-state message when no blocks match', () => {
        const result = getSearchResult('no matching block');
        const message = getSearchCategory(result)
            .querySelector('label')
            .getAttribute('text');
        expect(message).toBe('No blocks found');
    });

    test('keeps original block categories available while adding search results', () => {
        const result = getSearchResult('move');
        expect(result.querySelector('category[id="searchResults"]')).not.toBeNull();
        expect(result.querySelector('category[id="motion"]')).not.toBeNull();
        expect(result.querySelector('category[id="control"]')).not.toBeNull();
        expect(result.querySelector('category[id="operators"]')).not.toBeNull();
        expect(result.querySelector('category[id="motion"] block[type="motion_turnright"]')).not.toBeNull();
    });
});
