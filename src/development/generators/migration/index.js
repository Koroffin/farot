/**
 * Language Generator
 */

module.exports = {
    description: 'Generate new purge timestamp',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'What should it be called?',
            default: 'My Awesome Migration',
            validate: (value) => {
                if ((/.+/).test(value)) {
                    return true;
                }

                return 'The name is required';
            }
        }
    ],
    actions: () => {
        const actions = [
            {
                type: 'add',
                path: '../../migrations/' + new Date().getTime() + '_{{snakeCase name}}.txt',
                templateFile: './migration/migration.txt.hbs',
                abortOnFail: true
            }
        ];

        return actions;
    },
};
