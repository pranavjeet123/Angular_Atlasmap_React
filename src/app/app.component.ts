import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
} from '@angular/core';
import {
  AtlasmapProvider,
  IAtlasmapProviderProps,
  Atlasmap,
} from '@atlasmap/atlasmap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public rootDomID: string = 'rootDomId';

  protected getRootDomNode() {
    const node = document.getElementById(this.rootDomID);
    return node;
  }

  protected getProps(): IAtlasmapProviderProps {
    let baseJavaInspectionServiceUrl = '/v2/atlas/java/',
      baseXMLInspectionServiceUrl = '/v2/atlas/xml/',
      baseJSONInspectionServiceUrl = '/v2/atlas/json/',
      baseCSVInspectionServiceUrl = '/v2/atlas/csv/',
      baseMappingServiceUrl = '/v2/atlas/',
      logLevel = 'info';

    return {
      baseJavaInspectionServiceUrl,
      baseXMLInspectionServiceUrl,
      baseJSONInspectionServiceUrl,
      baseCSVInspectionServiceUrl,
      baseMappingServiceUrl,
      logLevel,
    };
  }

  // private isMounted(): boolean {
  //   return !!this.rootDomID;
  // }

  // protected render() {
  //   // if (this.isMounted()) {
  //   //   ReactDOM.render(
  //   //     React.createElement(
  //   //       AtlasmapProvider,
  //   //       this.getProps(),
  //   //       React.createElement(Atlasmap, {}, null)
  //   //     ),
  //   //     this.getRootDomNode()
  //   //   );
  //   // }

  //   ReactDOM.render(
  //     React.createElement(
  //       AtlasmapProvider,
  //       this.getProps(),
  //       React.createElement(Atlasmap, {}, null)
  //     ),
  //     this.getRootDomNode()
  //   );
  // }

  // ngOnInit() {
  //   console.log(this.rootDomID);
  // }



  ngOnDestroy() {
    // Uncomment if Angular 4 issue that ngOnDestroy is called AFTER DOM node removal is resolved
    // ReactDOM.unmountComponentAtNode(this.getRootDomNode())
  }



  private hasViewLoaded = false;

  public ngOnChanges() {
    this.renderComponent();
  }

  public ngAfterViewInit() {
    this.hasViewLoaded = true;
    this.renderComponent();
  }

  private renderComponent() {
    if (!this.hasViewLoaded) {
      return;
    }

    ReactDOM.render(
      React.createElement(
        AtlasmapProvider,
        this.getProps(), null
      ),
      this.getRootDomNode()
    );

  }
}



