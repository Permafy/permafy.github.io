import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import styles from './runtime-logs.css';

const MAX_LOG_ENTRIES = 500;

class RuntimeLogs extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            entries: []
        };
        this.nextEntryId = 0;
        this.handleRuntimeLog = this.handleRuntimeLog.bind(this);
        this.handleClearLogsEvent = this.handleClearLogsEvent.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }
    componentDidMount () {
        this.props.vm.runtime.addListener('RUNTIME_LOG', this.handleRuntimeLog);
        this.props.vm.runtime.addListener('RUNTIME_LOGS_CLEAR', this.handleClearLogsEvent);
    }
    componentWillUnmount () {
        this.props.vm.runtime.removeListener('RUNTIME_LOG', this.handleRuntimeLog);
        this.props.vm.runtime.removeListener('RUNTIME_LOGS_CLEAR', this.handleClearLogsEvent);
    }
    handleRuntimeLog (message) {
        const timestamp = new Intl.DateTimeFormat([], {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23'
        }).format(new Date());
        const entry = {
            id: this.nextEntryId++,
            text: `[${timestamp}]: ${String(message)}`
        };
        this.setState(({entries}) => ({
            entries: [...entries, entry].slice(-MAX_LOG_ENTRIES)
        }));
    }
    handleClearLogsEvent () {
        this.setState({entries: []});
    }
    handleClear () {
        this.setState({entries: []});
    }
    render () {
        const {entries} = this.state;
        return (
            <section className={styles.runtimeLogs}>
                <div className={styles.header}>
                    {entries.length > 0 ? (
                        <button
                            className={styles.clearButton}
                            type="button"
                            onClick={this.handleClear}
                        >
                            {'Clear'}
                        </button>
                    ) : null}
                </div>
                <div
                    aria-label="Runtime logs"
                    className={styles.logList}
                    aria-live="polite"
                    role="log"
                >
                    {entries.length > 0 ? entries.map(entry => (
                        <div
                            className={styles.logEntry}
                            key={entry.id}
                        >
                            {entry.text}
                        </div>
                    )) : (
                        <div className={styles.empty}>{'No logs yet.'}</div>
                    )}
                </div>
            </section>
        );
    }
}

RuntimeLogs.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired
};

export default RuntimeLogs;
