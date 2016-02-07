import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import StateMonitor from './devtools/statemonitor';
import StateStore from './store/statestore';

bootstrap(AppComponent, [StateMonitor, StateStore]);
