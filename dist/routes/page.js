"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const doctorsModel_1 = require("../model/doctorsModel");
const reportModel_1 = require("../model/reportModel");
const router = express_1.default.Router();
// pages
router.get('/', (req, res, next) => {
    res.render('Signup');
});
router.get('/login', (req, res, next) => {
    res.render('Login');
});
router.get('/create', auth_1.auth, async (req, res, next) => {
    res.render('CreateReport');
});
// get report and render on dashboard
router.get('/dashboard', auth_1.auth, async (req, res) => {
    try {
        const id = req.user.doctorsId;
        const { Reports } = await doctorsModel_1.DoctorInstance.findOne({ where: { doctorsId: id }, include: [{
                    model: reportModel_1.ReportInstance,
                    as: "Reports"
                }] });
        return res.render("Dashboard", {
            reports: Reports
        });
    }
    catch (error) {
        console.log(error);
    }
});
//   Update report
router.get('/update/:id', auth_1.auth, async (req, res) => {
    try {
        const patientId = req.params.id;
        const report = await reportModel_1.ReportInstance.findOne({ where: { patientId } });
        if (!report) {
            return res.render('Dashboard', { error: "Cannot find existing report" });
        }
        return res.render("Update", {
            title: "edit patient",
            report: report
        });
    }
    catch (error) {
        console.log(error);
    }
});
router.post("/editReport/:id", async (req, res) => {
    const patientId = req.params.id;
    const { patientName, age, hospitalName, weight, height, bloodGroup, genotype, bloodPressure, HIV_status, hepatitis, } = req.body;
    const report = await reportModel_1.ReportInstance.findOne({ where: { patientId } });
    const UpdatedReport = report?.update({
        patientName,
        age,
        hospitalName,
        weight,
        height,
        bloodGroup,
        genotype,
        bloodPressure,
        HIV_status,
        hepatitis,
    });
    return res.redirect("/dashboard");
});
//   delete report
router.get('/dashboard/:id', auth_1.auth, async (req, res) => {
    try {
        const patientId = req.params.id;
        const report = await reportModel_1.ReportInstance.findOne({ where: { patientId } });
        if (!report) {
            return res.render('Dashboard', { error: "Cannot find existing report" });
        }
        await report.destroy();
        return res.redirect('/dashboard');
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
