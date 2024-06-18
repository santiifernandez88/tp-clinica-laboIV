import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(),
  provideFirebaseApp(() => initializeApp({"projectId":"tp-clinica-laboiv","appId":"1:602436812338:web:d1dca5ca73b2bb140c862b","storageBucket":"tp-clinica-laboiv.appspot.com","apiKey":"AIzaSyADf4JhkMqJxwHTEmBSFzMhyIMevqv39-4","authDomain":"tp-clinica-laboiv.firebaseapp.com","messagingSenderId":"602436812338"})),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
  provideStorage(() => getStorage()), provideAnimationsAsync()]
};
