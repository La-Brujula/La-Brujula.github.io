import { useAuth } from '@/shared/providers/authProvider';
import ErrorMessage from '@shared/components/errorMessage';
import { LoadingSpinner } from '@shared/components/loadingSpinner';
import { Container } from '@shared/layout/container';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const Route = createLazyFileRoute('/profile/_edit/passwordReset')({
  component: PasswordResetPage,
});

function PasswordResetPage() {
  const { t } = useTranslation('auth');
  const { register, handleSubmit } = useForm<{ email: string }>();
  const { resetUserPassword } = useAuth(['resetUserPassword']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const formHandler = useCallback(
    async (values: { email: string }) => {
      setError(null);
      setLoading(true);
      try {
        await resetUserPassword(values.email);
        setEmailSent(true);
      } catch (e) {
        switch (e.code) {
          case 'auth/user-not-found':
            setError(
              t(
                'No tenemos registrada esta cuenta, por favor revisa tu información.'
              )
            );
            break;
          case 'auth/no-account':
            setError(
              t(
                'No hay una cuenta registrada con ese correo, por favor revisa tu información.'
              )
            );
            break;
          default:
            setError((e as any).toString());
        }
      }
      setLoading(false);
    },
    [resetUserPassword]
  );

  return (
    <Container>
      <h1 className="mb-8 text-secondary text-4xl">
        {t('Reiniciar contraseña')}
      </h1>
      <p className="mb-4">
        {t(
          'Escribe tu correo aquí y si está registrado te llegará un correo para reiniciar tu contraseña'
        )}
      </p>
      {error && (
        <>
          <ErrorMessage message={error.toString()} />
          <div className="my-4"></div>
        </>
      )}
      {loading ? (
        <LoadingSpinner />
      ) : !emailSent ? (
        <form
          onSubmit={handleSubmit(formHandler)}
          className="grid md:grid-cols-[min-content_1fr] flex-wrap gap-4
          justify-center text-left items-center max-w-md mx-auto"
        >
          <label htmlFor="email">{t('email')}</label>
          <input
            type="email"
            id="email"
            {...register('email', { required: true })}
            required
          />
          <input
            type="submit"
            value={t('Enviar Correo')}
            className="col-span-full mx-auto w-fit"
          />
        </form>
      ) : (
        <>
          <p className="px-4 py-2 rounded-md bg-emerald-400 text-white font-bold">
            {t(
              'Se ha enviado el correo con el link para reiniciar tu contraseña'
            )}
          </p>
          <Link
            to="/auth/login"
            className="max-w-xs mx-auto bg-primary px-4 py-2 text-white
            rounded-md mt-4 block font-bold"
          >
            {t('Iniciar Sesión')}
          </Link>
        </>
      )}
    </Container>
  );
}

export default PasswordResetPage;
