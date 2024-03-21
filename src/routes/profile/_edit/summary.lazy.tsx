import DataSuspense from '@/shared/components/dataSuspense';
import { useCurrentProfile } from '@/shared/hooks/useCurrentProfile';
import { useProfile } from '@/shared/hooks/useUser';
import { useAuth } from '@/shared/providers/authProvider';
import { ProfileHeader } from '@modules/profile/components/profileHeader';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import ErrorMessage from '@shared/components/errorMessage';
import { getTitle } from '@shared/utils/areaUtils';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createLazyFileRoute('/profile/_edit/summary')({
  component: ProfileSummary,
});

function ProfileSummary() {
  const { t } = useTranslation(['auth', 'genders', 'countries']);
  const { data: user, isLoading, error } = useCurrentProfile();

  return (
    <DataSuspense
      loading={isLoading}
      error={error}
      errorComponent={
        <ErrorMessage
          message={(error || t('No user could be found')).toString()}
        />
      }
    >
      <div
        className="grid grid-cols-[max-content_max-content]
      text-right gap-x-8 gap-y-4 mx-auto mt-8 w-auto justify-center"
      >
        <h3>
          <EmailOutlined />
        </h3>
        <a
          href={`mailto:${user?.primaryEmail}`}
          className="text-left text-primary underline"
        >
          {user?.primaryEmail}
        </a>
        <div className="col-span-2"></div>
        <h3>{user?.type != 'moral' ? t('Nombre') : t('Razón Social')}</h3>
        <p className="text-left text-primary">{user?.fullName}</p>
        {user?.nickname && (
          <>
            <h3>{t('Nickname')}</h3>
            <p className="text-left text-primary">{user?.nickname}</p>
          </>
        )}
        {user?.type != 'moral' && (
          <>
            <h3>{t('Género')}</h3>
            <p className="text-left text-primary">
              {t(user?.gender, { ns: 'genders' })}
            </p>
          </>
        )}
        <div className="col-span-2"></div>
        <h3>{t('Actividad Principal')}</h3>
        <p className="text-left text-primary">
          {!!user?.primaryActivity &&
            getTitle(user?.primaryActivity, user?.gender)}
        </p>
        <div className="col-span-2"></div>
        <h3>{t('Ciudad')}</h3>
        <p className="text-left text-primary">{user?.city}</p>
        <h3>{t('Estado')}</h3>
        <p className="text-left text-primary">{user?.state}</p>
        <h3>{t('País')}</h3>
        <p className="text-left text-primary">
          {t(user?.country, { ns: 'countries' })}
        </p>
        <h3>
          <PhoneOutlined />
        </h3>
        <a
          href={`tel:${user?.phoneNumbers[0]}`}
          className="text-left text-primary underline"
        >
          {user?.phoneNumbers[0]}
        </a>
      </div>
      <div className="flex flex-row gap-4 self-center justify-center my-8">
        <Link to="/profile/edit/standOut">
          <div className="button font-bold">{t('Continuar')}</div>
        </Link>
      </div>
    </DataSuspense>
  );
}

export default ProfileSummary;