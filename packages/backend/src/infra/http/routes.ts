import express from 'express';
import {
  academicYearRouter,
  genderRouter,
  gradeLevelRouter,
  serviceTypeGroupRouter,
  stateRouter,
} from '../../modules/reference/infra/http';
import { districtRouter } from '../../modules/organization/infra/http';
import { referralRouter, studentRouter } from '../../modules/people/infra/http';
import { serviceTypeRouter } from '../../modules/reference/infra/http';
import { Shield } from '../../utils';
import { authRouter, roleRouter, therapistRouter, userRouter } from '../../modules/user/infra/http';
import { documentationRouter } from '../../modules/services/infra/http';
import { pingRouter } from './ping';

export const router = express.Router();

router.use(`/ping`, pingRouter);

// Identity
router.use(`/auth`, authRouter);
router.use(`/user`, Shield, userRouter);
router.use(`/role`, Shield, roleRouter);
router.use(`/therapist`, Shield, therapistRouter);

// People
router.use(`/referral`, Shield, referralRouter);

// Services
router.use(`/note`, Shield, documentationRouter);

// People
router.use(`/student`, Shield, studentRouter);

// Organization
router.use(`/district`, Shield, districtRouter);

// Reference
router.use(`/academic-year`, Shield, academicYearRouter);
router.use(`/gender`, Shield, genderRouter);
router.use(`/grade-level`, Shield, gradeLevelRouter);
router.use(`/service-type`, Shield, serviceTypeRouter);
router.use(`/service-type-group`, Shield, serviceTypeGroupRouter);
router.use(`/state`, Shield, stateRouter);
