import React, { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmationContext, ConfirmProps } from '@/contexts/ConfirmationContext';
import { cn } from '@/lib/utils';

export const ConfirmationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ show, setShow ] = useState(false);
  const [ reason, setReason ] = useState<any>();
  const [ reasonProvided, setReasonProvided ] = useState<boolean>();
  const [ confirmation, setConfirmation ] = useState<ConfirmProps>();

  const createConfirmation = (props: ConfirmProps) => {
    setConfirmation(props);
    setShow(true);
  };

  return <ConfirmationContext.Provider value={{ createConfirmation }}>
    {children}
    {confirmation &&
      <Dialog
        open={show}
        onOpenChange={setShow}
      >
        <DialogContent
          data-testid="confirmationModal"
          className={confirmation.stackedModal ? `stacked-modal` : ``}
        >
          <DialogHeader>
            <DialogTitle>{confirmation.title}</DialogTitle>
          </DialogHeader>
          <div className="text-foreground" data-testid="confirmationModal">
            {confirmation.message || `Are you sure?`}
            {
              confirmation.reasonComponent && <div className="mt-3">
                {confirmation.reasonComponent(setReason, setReasonProvided, reason)}
              </div>
            }
          </div>
          <DialogFooter>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                data-testid="cancelButton"
                onClick={() => setShow(false)}
              >
                {confirmation.cancelText || `Cancel`}
              </Button>
              <Button
                variant={confirmation.variant || `destructive`}
                className={cn({
                  'bg-green-600 text-white hover:bg-green-700': confirmation.variant === `default`,
                })}
                data-testid="confirmButton"
                disabled={!!confirmation.reasonComponent && !reasonProvided}
                onClick={() => {
                  confirmation.onConfirm(reason);
                  setReason(null);
                  setReasonProvided(false);
                  setShow(false);
                }}
              >
                {confirmation.confirmText || `Confirm`}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>}
  </ConfirmationContext.Provider>;
};
