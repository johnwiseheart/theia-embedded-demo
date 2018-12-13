// this needs to come first
import 'reflect-metadata';
// so lets stick it up here
import { FrontendApplication } from '@theia/core/lib/browser';
import { Container, ContainerModule } from 'inversify';
import { FrontendApplicationConfigProvider } from '@theia/core/lib/browser/frontend-application-config-provider';
import { frontendApplicationModule } from '@theia/core/lib/browser/frontend-application-module';
import { messagingFrontendModule } from '@theia/core/lib/browser/messaging/messaging-frontend-module';
import { loggerFrontendModule } from '@theia/core/lib/browser/logger-frontend-module';
import browserMenuModule from '@theia/core/lib/browser/menu/browser-menu-module';
import { ThemeService } from '@theia/core/lib/browser/theming';

class MyFrontendApplication extends FrontendApplication {
  protected getHost(): Promise<HTMLElement> {
      const element = document.getElementById("react-container");
      if (element != null) {
        return Promise.resolve(element);
      }
      throw new Error("Couldn't find container")
  }
}

const runApplication = () => {
  const frontendAppModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(FrontendApplication).to(MyFrontendApplication).inSingletonScope();
  });


  FrontendApplicationConfigProvider.set({
    applicationName: "Theia"
  })

  const container = new Container();
  container.load(frontendAppModule); // Commenting this line and the one below makes it work
  container.load(browserMenuModule);
  container.load(frontendApplicationModule);
  container.load(messagingFrontendModule);
  container.load(loggerFrontendModule);

  try {
      const themeService = ThemeService.get();
      themeService.loadUserTheme();

      // const application = container.get(FrontendApplication);
      const application = container.get(MyFrontendApplication);  // Commenting this line and the one above makes it work
      application.start();
  } catch (error) {
    console.error('Failed to start the frontend application.');
    if (error) {
        console.error(error);
    }
  }
}

runApplication();