// this needs to come first
import 'reflect-metadata';
// so lets stick it up here

import { FrontendApplication, ContextMenuRenderer  } from '@theia/core/lib/browser';
import { Container, ContainerModule } from 'inversify';
import { FrontendApplicationConfigProvider } from '@theia/core/lib/browser/frontend-application-config-provider';
import { frontendApplicationModule } from '@theia/core/lib/browser/frontend-application-module';
import { messagingFrontendModule } from '@theia/core/lib/browser/messaging/messaging-frontend-module';
import { loggerFrontendModule } from '@theia/core/lib/browser/logger-frontend-module';
import { ThemeService } from '@theia/core/lib/browser/theming';

// class App extends React.Component {
//     render() {






//       return (
//         <div>Hi</div>
//       );
//     }
//   }


// const wrapper = document.getElementById("react-container");
// wrapper ? ReactDOM.render(<App />, wrapper) : false;

const runApplication = () => {
  FrontendApplicationConfigProvider.set({
    applicationName: "Theia"
  })

  const container = new Container();
  container.load(frontendApplicationModule);
  container.load(messagingFrontendModule);
  container.load(loggerFrontendModule);

  function load(raw: any) {
      return Promise.resolve(raw.default).then(module =>
          container.load(module)
      )
  }

  function start() {
      const themeService = ThemeService.get();
      themeService.loadUserTheme();

      const application = container.get(FrontendApplication);
      application.start();
  }

  Promise.resolve()
    .then(start).catch(reason => {
        console.error('Failed to start the frontend application.');
        if (reason) {
            console.error(reason);
        }
    });
}

runApplication();