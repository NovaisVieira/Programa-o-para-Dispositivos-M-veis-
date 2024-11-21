import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence, 
  onAuthStateChanged, 
  signInAnonymously 
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  query, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSZpg8wmIpgUORqem3Of6EGahZj6FvMf4",
  authDomain: "todolist-8ee77.firebaseapp.com",
  projectId: "todolist-8ee77",
  storageBucket: "todolist-8ee77.firebasestorage.app",
  messagingSenderId: "887226666119",
  appId: "1:887226666119:web:f6ab2430d65682e5be3c22"
};

// Inicializar Firebase, Auth e Firestore apenas uma vez
let app;
let auth;
let db;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  db = getFirestore(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

class Fire {
  constructor(callback) {
    this.auth = auth;
    this.db = db;
    this.init(callback);
  }

  init(callback) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('User UID:', user.uid); // Log do UID
        callback(null, user);
      } else {
        signInAnonymously(this.auth).catch(error => {
          callback(error);
        });
      }
    });
  }

  getLists(callback) {
    if (this.userId) {
      const ref = collection(this.db, 'users', this.userId, 'lists');
      const q = query(ref);

      this.unsubscribe = onSnapshot(q, (snapshot) => {
        const lists = [];
        snapshot.forEach((doc) => {
          lists.push({ id: doc.id, ...doc.data() });
        });
        callback(lists);
      });
    } else {
      console.error("User not authenticated");
    }
  }

  async addList(list) {
    const ref = collection(this.db, 'users', this.userId, 'lists');
    await addDoc(ref, list);
  }

  async updateList(list) {
    const ref = doc(this.db, 'users', this.userId, 'lists', list.id);
    await updateDoc(ref, list);
  }

  async deleteList(listId) {
    if (this.userId) {
      const ref = doc(this.db, 'users', this.userId, 'lists', listId);
      await deleteDoc(ref); // Remove a lista do Firebase
    } else {
      console.error("User not authenticated");
    }
  }

  get userId() {
    const user = this.auth.currentUser;
    return user ? user.uid : null; // Retorna null se não houver usuário autenticado
  }

  detach() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default Fire;
