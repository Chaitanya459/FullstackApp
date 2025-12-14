import React, { useState } from 'react';
import { ReferralDTO } from 'rsd';
import { useParams } from 'react-router-dom';
import { ServiceSelection } from './NewReferralSteps/ServiceSelection';
import { IntakeForm } from './NewReferralSteps/IntakeForm';
import { SupportingDocuments } from './NewReferralSteps/SupportingDocuments';
import { useGetReferralById } from '@/services/ReferralService';

type ReferralStep = `serviceSelection` | `intakeForm` | `supportingDocuments`;

const NewReferral: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { data: referralData } = useGetReferralById(id);
  const [ mainStep, setMainStep ] = useState<ReferralStep>(id ? `intakeForm` : `serviceSelection`);

  const renderStep = (step: ReferralStep) => {
    switch (step) {
      case `serviceSelection`:
        return <ServiceSelection onSelect={() => setMainStep(`intakeForm`)} />;
      case `intakeForm`:
        return <IntakeForm
          onSubmit={() => setMainStep(`supportingDocuments`)}
          referralData={referralData as Partial<ReferralDTO>}
        />;
      case `supportingDocuments`:
        return <SupportingDocuments />;
    }
  };

  return <div>
    <div className="mt-8 text-center">
      <h1 className="text-2xl font-bold">MONTGOMERY COUNTY EDUCATIONAL SERVICE CENTER</h1>
    </div>
    <h1 className=" px-4 pt-2 pb-6 text-center text-xl font-bold"> Specialized and Related Services</h1>

    {renderStep(mainStep)}
  </div>;
};

export default NewReferral;
