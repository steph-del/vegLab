import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ErrorsModule } from './_errors/errors.module';

// user pages and components
import { AuthComponent } from './user/auth/auth.component';
import { ProfilePageComponent } from './user/profile-page/profile-page.component';
import { MyDataPageComponent } from './user/my-data-page/my-data-page.component';
import { MyMapComponent } from './user/my-map/my-map.component';

// shared pages and components
import { MainMenuComponent } from './shared/main-menu/main-menu.component';
import { HomePageComponent } from './shared/home-page/home-page.component';
import { LoginPageComponent } from './shared/login-page/login-page.component';
import { FatalErrorPageComponent } from './shared/fatal-error-page/fatal-error-page.component';

import { NotificationComponent } from './shared/notification/notification.component';

import { MapComponent } from './shared/map/map.component';
import { DrawSearchMapComponent } from './shared/map/draw-search-map/draw-search-map.component';

import { OccurrenceFormComponent } from './shared/occurrence-form/occurrence-form.component';
import { OccurrenceCardComponent } from './shared/occurrence-card/occurrence-card.component';
import { OccurrenceSearchComponent, OccurrenceSearchMetadataModal1Component } from './shared/occurrence-search/occurrence-search.component';

import { TableComponent } from './shared/table/table.component';
import { TableCardComponent } from './shared/table-card/table-card.component';
import { TableFormComponent } from './shared/table-form/table-form.component';
import { TableSearchComponent } from './shared/table-search/table-search.component';
import { TableImportComponent } from './shared/table-import/table-import.component';

import { PdfViewerComponent } from './shared/pdf-viewer/pdf-viewer.component';

import { MetadataInputComponent } from './shared/metadata-input/metadata-input.component';

// admin pages and components
import { AdminHomePageComponent } from './admin/admin-home-page/admin-home-page.component';
import { AdminMetadataPageComponent } from './admin/metadata/admin-metadata-page/admin-metadata-page.component';

import { AdminCreateMetadataComponent } from './admin/metadata/admin-create-metadata/admin-create-metadata.component';
import { AdminEditMetadataComponent } from './admin/metadata/admin-edit-metadata/admin-edit-metadata.component';
import { AdminRemoveMetadataComponent } from './admin/metadata/admin-remove-metadata/admin-remove-metadata.component';
import { AdminTestMetadataComponent } from './admin/metadata/admin-test-metadata/admin-test-metadata.component';

// services
import { UserService } from './_services/user.service';
import { NotificationService } from './_services/notification.service';
import { MenuService } from './_services/menu.service';
import { OccurrenceService } from './_services/occurrence.service';
import { TableService } from './_services/table.service';
import { MetadataService } from './_services/metadata.service';
import { PhotoService } from './_services/photo.service';
import { LayerService} from './_services/layer.service';

// pipes
import { LevelPipe } from './_pipes/level.pipe';
import { ShortLevelPipe } from './_pipes/short-level.pipe';
import { MomentPipe } from './_pipes/moment.pipe';
import { MomentLocalDatePipe } from './_pipes/moment-local-date.pipe';

// WS phyto
import { PhytoHomePageComponent } from './wsPhyto/phyto-home-page/phyto-home-page.component';
import { PhytoAppPageComponent } from './wsPhyto/phyto-app-page/phyto-app-page.component';

// WS forest
import { ForestHomePageComponent } from './wsForest/forest-home-page/forest-home-page.component';
import { ForestAppPageComponent } from './wsForest/forest-app-page/forest-app-page.component';

// third parts modules
import { MaterialModule } from './material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TbGeolocLibModule } from 'tb-geoloc-lib';
import { TbTsbLibModule } from 'tb-tsb-lib';
import { TbDropfileLibModule } from 'tb-dropfile-lib';
import { FocusDirective } from './_directives/focus.directive';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { MetadataFilterComponent } from './shared/metadata-filter/metadata-filter.component';
import { CitySearchComponent } from './shared/city-search/city-search.component';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { HotTableModule } from '@handsontable/angular';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSplitModule } from 'angular-split';
import { ObserverSearchComponent } from './shared/observer-search/observer-search.component';
import { BiblioSearchComponent } from './shared/biblio-search/biblio-search.component';
import { OccurrencesInlineComponent } from './shared/occurrences-inline/occurrences-inline.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TableOverviewMapComponent } from './shared/map/table-overview-map/table-overview-map/table-overview-map.component';

/*
import * as Sentry from '@sentry/browser';
Sentry.init({
  dsn: 'https://3cd3bcc6591d450d9f0808b78675a4b0@sentry.io/1542725'
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
    Sentry.showReportDialog({ eventId });
  }
}
*/

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthComponent, ProfilePageComponent, MyDataPageComponent, MyMapComponent, // user components
    HomePageComponent, OccurrenceFormComponent, MapComponent, TableComponent, OccurrenceCardComponent, TableCardComponent, // shared components
    MetadataInputComponent, OccurrenceSearchComponent, OccurrenceSearchMetadataModal1Component, DrawSearchMapComponent, // shared components
    MainMenuComponent, NotificationComponent, FatalErrorPageComponent, // shared components
    TableFormComponent, TableSearchComponent, TableImportComponent, // shared components
    FocusDirective, // directives
    LevelPipe, ShortLevelPipe, MomentPipe, MomentLocalDatePipe, // Pipes
    PhytoHomePageComponent, PhytoAppPageComponent, // WS phyto
    ForestHomePageComponent, ForestAppPageComponent, // WS forest
    AdminHomePageComponent, AdminMetadataPageComponent, AdminCreateMetadataComponent, AdminEditMetadataComponent, AdminRemoveMetadataComponent, AdminTestMetadataComponent, MetadataFilterComponent, CitySearchComponent, ObserverSearchComponent, BiblioSearchComponent, OccurrencesInlineComponent, PdfViewerComponent, TableOverviewMapComponent, // admin
  ],
  entryComponents: [
    OccurrenceSearchMetadataModal1Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ErrorsModule,
    TbGeolocLibModule,
    TbTsbLibModule,
    TbDropfileLibModule,
    LeafletModule.forRoot(), LeafletDrawModule.forRoot(),
    HotTableModule.forRoot(),
    NgbPopoverModule,
    AngularSplitModule.forRoot(),
    PdfViewerModule
  ],
  providers: [UserService, NotificationService, MenuService, OccurrenceService, TableService, MetadataService, PhotoService, LayerService,
              {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
              {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
              {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
              {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
              /*{provide: ErrorHandler, useClass: SentryErrorHandler}*/
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
