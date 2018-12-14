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

import "./index.css";

const getFrontendModule = (host: HTMLElement) => new ContainerModule((_bind, _unbind, _isBound, rebind) => {
  class MyFrontendApplication extends FrontendApplication {
    protected getHost(): Promise<HTMLElement> {
      return Promise.resolve(host);
    }
  }

  rebind(FrontendApplication).to(MyFrontendApplication).inSingletonScope();
});

export const runApplication = (appElement: HTMLElement) => {
  FrontendApplicationConfigProvider.set({
    applicationName: "Theia"
  })

  const container = new Container();
  container.load(browserMenuModule);
  container.load(frontendApplicationModule);
  container.load(messagingFrontendModule);
  container.load(loggerFrontendModule);
  container.load(getFrontendModule(appElement));

  try {
      const themeService = ThemeService.get();
      themeService.loadUserTheme();

      const application = container.get(FrontendApplication);
      application.start();
  } catch (error) {
    console.error('Failed to start the frontend application.');
    if (error) {
        console.error(error);
    }
  }
}

