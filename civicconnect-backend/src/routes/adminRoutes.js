import { Router } from "express";
import { createOfficer, listOfficers, setOfficerActive } from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Every route below needs a logged-in ADMIN. The role check happens HERE on the server,
// so it cannot be bypassed by editing the frontend.
router.use(requireAuth, requireRole("ADMIN"));

router.post("/officers", createOfficer);
router.get("/officers", listOfficers);
router.patch("/officers/:id/active", setOfficerActive);

export default router;
