// @utils/renderWelcome.ts
import type { LedgerManager } from '@lib/LedgerManager.ts';
import {
  createUserAndLogin,
  verifyUserLogin,
  restoreBackupFromJsonString,
} from '@services/welcomeService';
import { ROUTES } from '@constants/routes';
import { ejecutarRenderSeguro } from './baseRender';

interface WelcomeDomElements {
  profileSelection: HTMLElement | null;

  loadingPlaceholder: HTMLElement | null;
  notProfilePlaceholder: HTMLElement | null;
  profileListContainer: HTMLElement | null;
  profileTemplate: HTMLTemplateElement | null;

  formCreateUser: HTMLFormElement | null;
  btnCancelarCreacion: HTMLElement | null;
  formLoginUser: HTMLFormElement | null;
  btnCancelarLogin: HTMLElement | null;

  welcomeActions: HTMLElement | null;
  btnMostrarForm: HTMLElement | null;
  btnSubirRespaldo: HTMLElement | null;
  fileInputBackup: HTMLInputElement | null;
}

/**
 * Inicializa la página de bienvenida inyectando el motor contable (LedgerManager).
 */
export async function initWelcomePage(
  ledgerEngine: LedgerManager,
): Promise<void> {
  await ejecutarRenderSeguro(
    async () => {
      // Evaluamos el estado de los usuarios locales usando el motor inyectado
      const users = ledgerEngine.getUsers();
      const hasUsers = users.length > 0;

      // Referencias a elementos del DOM
      const domElements: WelcomeDomElements = {
        profileSelection: document.getElementById('welcome-profile-selection'),

        loadingPlaceholder: document.getElementById('loading-placeholder'),
        notProfilePlaceholder: document.getElementById(
          'not-profile-placeholder',
        ),
        profileListContainer: document.getElementById('profile-list-container'),
        profileTemplate: document.getElementById(
          'profile-template',
        ) as HTMLTemplateElement,

        formCreateUser: document.getElementById(
          'form-create-user',
        ) as HTMLFormElement,
        btnCancelarCreacion: document.getElementById('btn-cancelar-creacion'),
        formLoginUser: document.getElementById(
          'form-login-user',
        ) as HTMLFormElement,
        btnCancelarLogin: document.getElementById('btn-cancelar-login'),

        welcomeActions: document.getElementById('welcome-actions'),
        btnMostrarForm: document.getElementById('btn-mostrar-form'),
        btnSubirRespaldo: document.getElementById('btn-subir-respaldo'),
        fileInputBackup: document.getElementById(
          'file-input-backup',
        ) as HTMLInputElement,
      };

      // Ocultamos el placeholder de carga inicial
      if (domElements.loadingPlaceholder) {
        domElements.loadingPlaceholder.style.display = 'none';
      }

      if (hasUsers) {
        if (domElements.notProfilePlaceholder) {
          domElements.notProfilePlaceholder.style.display = 'none';
        }
        if (domElements.profileListContainer && domElements.formLoginUser) {
          domElements.profileListContainer.style.display = 'flex';
          renderProfileList(domElements, users);
        }
      } else {
        if (domElements.notProfilePlaceholder) {
          domElements.notProfilePlaceholder.style.display = 'flex';
        }
      }

      // Configurar listeners y eventos de la interfaz, pasándole el motor al scope necesario
      setupEventListeners(domElements, ledgerEngine);
    },
    'Módulo de bienvenida',
    ledgerEngine,
  );
}

/**
 * Renderiza dinámicamente la lista de perfiles existentes en el contenedor.
 */
function renderProfileList(
  domElements: WelcomeDomElements,
  users: Array<{ id: string; name: string; avatar: string }>,
): void {
  const profileSelectionView = domElements.profileSelection;
  const container = domElements.profileListContainer;
  const profile_template = domElements.profileTemplate;
  const actions = domElements.welcomeActions;
  const formLogin = domElements.formLoginUser;

  if (container) {
    container.innerHTML = '';

    if ('content' in document.createElement('template') && profile_template) {
      users.forEach((user) => {
        const item = document.importNode(profile_template.content, true);
        const profile = item.querySelector('.profile');
        profile?.setAttribute('data-user-id', user.id);
        const avatar = item.querySelector('.profile_avatar');
        if (avatar) avatar.textContent = user.avatar;
        const name = item.querySelector('.profile_name');
        if (name) name.textContent = user.name;

        profile?.addEventListener('click', () => {
          if (profileSelectionView) profileSelectionView.style.display = 'none';

          if (actions) actions.style.display = 'none';

          if (formLogin) {
            formLogin.style.display = 'flex';
            formLogin.dataset.targetUserId = user.id;

            const profileAvatar = document.getElementById(
              'login-profile-avatar',
            ) as HTMLElement;
            profileAvatar.innerHTML = user.avatar;

            const profileName = document.getElementById(
              'login-profile-name',
            ) as HTMLElement;
            profileName.innerHTML = user.name;

            const passwordInput = document.getElementById(
              'user-pass-login',
            ) as HTMLInputElement;
            passwordInput.autofocus = true;
          }
        });

        container.appendChild(item);
      });
    } else if ('content' in document.createElement('template')) {
      const err_message = `Problemas con la carga del template para los perfiles.`;
      alert(err_message);
    } else {
      const err_message = `Buscar otra manera de añadir perfiles porque el elemento template no está soportado.`;
      alert(err_message);
    }
  }
}

/**
 * Configura todos los listeners de eventos de la vista de bienvenida/perfiles.
 */
function setupEventListeners(
  domElements: WelcomeDomElements,
  ledgerEngine: LedgerManager,
): void {
  // Mostrar formulario de creación de usuario
  domElements.btnMostrarForm?.addEventListener('click', () => {
    if (domElements.profileSelection)
      domElements.profileSelection.style.display = 'none';
    if (domElements.welcomeActions)
      domElements.welcomeActions.style.display = 'none';
    if (domElements.formCreateUser)
      domElements.formCreateUser.style.display = 'flex';
  });

  // Cancelar creación de usuario
  domElements.btnCancelarCreacion?.addEventListener('click', () => {
    if (domElements.formCreateUser)
      domElements.formCreateUser.style.display = 'none';
    if (domElements.profileSelection)
      domElements.profileSelection.style.display = 'flex';
    if (domElements.welcomeActions)
      domElements.welcomeActions.style.display = 'flex';
  });

  // Manejo de envío del formulario de creación de usuario
  domElements.formCreateUser?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById(
      'user-name-create',
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      'user-pass-create',
    ) as HTMLInputElement;
    const confirmPasswordInput = document.getElementById(
      'user-pass-confirm',
    ) as HTMLInputElement;

    if (passwordInput.value !== confirmPasswordInput.value) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      await createUserAndLogin(
        ledgerEngine,
        nameInput.value,
        passwordInput.value,
      );
      window.location.href = ROUTES.APPDASHBOARD;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      alert('Hubo un error al guardar el usuario en IndexedDB.');
    }
  });

  // Cancelar login de usuario
  domElements.btnCancelarLogin?.addEventListener('click', () => {
    if (domElements.formLoginUser)
      domElements.formLoginUser.style.display = 'none';
    if (domElements.profileSelection)
      domElements.profileSelection.style.display = 'flex';
    if (domElements.welcomeActions)
      domElements.welcomeActions.style.display = 'flex';

    const nameInput = document.getElementById(
      'user-name-login',
    ) as HTMLInputElement;
    if (nameInput) nameInput.value = '';

    const passInput = document.getElementById(
      'user-name-login',
    ) as HTMLInputElement;
    if (passInput) passInput.value = '';
  });

  // Manejo de envío del formulario de login de usuario
  domElements.formLoginUser?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userID = domElements.formLoginUser?.dataset.targetUserId;
    if (!userID) throw new Error('No se especificó el usuario.');

    const passwordInput = document.getElementById(
      'user-pass-login',
    ) as HTMLInputElement;

    try {
      await verifyUserLogin(ledgerEngine, userID, passwordInput.value);
      window.location.href = ROUTES.APPDASHBOARD;
    } catch (error: any) {
      console.error('Error al autenticar el usuario:', error);
      alert(error.message || 'Hubo un error al procesar la autenticación.');
    }
  });

  // Disparar input de respaldo JSON
  domElements.btnSubirRespaldo?.addEventListener('click', () => {
    domElements.fileInputBackup?.click();
  });

  // Manejo de restauración de respaldo JSON
  domElements.fileInputBackup?.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonString = event.target?.result as string;
        // Pasamos el ledgerEngine inyectado al servicio de restauración
        await restoreBackupFromJsonString(ledgerEngine, jsonString);

        alert('¡Respaldo restaurado con éxito!');
        window.location.href = ROUTES.APPDASHBOARD;
      } catch (err) {
        console.error('Error al restaurar JSON:', err);
        alert('El archivo JSON no es válido o está corrupto.');
      }
    };
    reader.readAsText(file);
  });
}
