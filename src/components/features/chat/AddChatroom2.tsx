'use client'

// import { useUser } from "@clerk/nextjs";
import React from 'react'

import Loading from '@/components/ui/common/Loading'
import CheckoutDetailsPage from '@/components/ui/elements/stepper/CheckoutDetailsPage'
import CompletionPage from '@/components/ui/elements/stepper/CompletionPage'
import PaymentPage from '@/components/ui/elements/stepper/PaymentPage'
import WizardStepper from '@/components/ui/elements/stepper/WizardStepper'

import { useCheckoutNavigation } from '@/hooks/useCheckoutNavigation'

const CheckoutWizard = () => {
	//   const { isLoaded } = useUser();
	const { checkoutStep } = useCheckoutNavigation()

	//   if (!isLoaded) return <Loading />;

	const renderStep = () => {
		switch (checkoutStep) {
			case 1:
				return <CheckoutDetailsPage />
			case 2:
				return <PaymentPage />
			case 3:
				return <CompletionPage />
			// default:
			// 	return <CheckoutDetailsPage />
		}
	}

	return (
		<div className='checkout'>
			<WizardStepper currentStep={checkoutStep} />
			<div className='checkout__content'>{renderStep()}</div>
		</div>
	)
}

export default CheckoutWizard
