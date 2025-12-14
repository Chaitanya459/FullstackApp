import MCESCLogo from '@/assets/mcesc_logo.png';
import { LoginForm } from '@/components/login-form';

const UnauthenticatedApp: React.FC = () =>
  <div className="flex min-h-screen w-full flex-col">
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="https://www.mcesc.org/" className="flex items-center gap-2 font-medium">
            <div className="flex size-20 items-center justify-center">
              <img src={MCESCLogo} alt="company logo" className="invert transition dark:brightness-200 dark:invert-0" />
              <span className="sr-only">Related Services Documentation (RSD)</span>
            </div>
            RSD
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative -mr-9 hidden bg-muted lg:block">
        <img
          src="https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_2/v1698781857/mcescorg/wpkvlvs4ob5vpf4ggyrj/LCNBuilding.jpg"
          alt="MCESC Building"
          className="absolute inset-0 size-full object-cover dark:brightness-[0.5]"
        />
      </div>
    </div>
  </div>;

export default UnauthenticatedApp;
