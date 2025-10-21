-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2025 at 03:50 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cdmis_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateRecordDisposalDates` ()   BEGIN
    -- NOTE: This procedure is a template. A robust implementation requires a sophisticated
    -- parser in the backend application (e.g., Python, Node.js, PHP) to accurately interpret
    -- the diverse text in the 'authorized_retention_period' column and calculate dates.
    -- The examples below handle only the most straightforward cases.

    -- Step 1: Handle PERMANENT records by setting their disposal date to NULL.
    UPDATE records r
    JOIN disposition_schedule ds ON r.disposition_provision = ds.item_number
    SET r.calculated_disposal_date = NULL
    WHERE ds.authorized_retention_period = 'PERMANENT';

    -- Step 2: Handle simple "X years" retention periods.
    -- This is a placeholder for a more complex date calculation logic.
    -- For example, update records with a "2 years after..." rule.
    UPDATE records r
    JOIN disposition_schedule ds ON r.disposition_provision = ds.item_number
    SET r.calculated_disposition_date = DATE_ADD(r.date_of_record, INTERVAL 2 YEAR)
    WHERE ds.authorized_retention_period LIKE '2 years%';

    -- Add more specific update statements here for other common retention periods
    -- (e.g., '1 year%', '3 years%', '5 years%', '10 years%', etc.)

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `office` varchar(255) NOT NULL COMMENT 'Name of the department/office of the user',
  `operation` varchar(255) NOT NULL COMMENT 'e.g., Login, Upload, View, Request, Delete',
  `action_date_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `record_series_title_description` text DEFAULT NULL COMMENT 'The title of the record involved in the action',
  `details` text DEFAULT NULL COMMENT 'Additional details, e.g., IP address, file name'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Name of the department or office',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `disposition_schedule`
--

CREATE TABLE `disposition_schedule` (
  `item_number` varchar(10) NOT NULL,
  `record_series_title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `authorized_retention_period` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disposition_schedule`
--

INSERT INTO `disposition_schedule` (`item_number`, `record_series_title`, `description`, `authorized_retention_period`) VALUES
('1', 'Acknowledgment Receipts', NULL, 'To be filed with appropriate records series'),
('10', 'Feasibility Studies', NULL, 'PERMANENT if implemented, otherwise dispose after 5 years from date of record'),
('100', 'Employee Interview Records', NULL, '1 year'),
('101', 'Handwriting Specimens/Signature', NULL, 'PERMANENT'),
('102', 'Job Order Employment Contracts', NULL, '5 years after terminated'),
('103', 'Leave Credit Cards', NULL, '15 years after separated/retired'),
('104', 'Lists of Eligibles/Non-Eligibles', NULL, '1 year after updated'),
('105', 'Logbooks', 'Arrival & Departure of Employees, Attendance, Clearances Issued', '2 years after date of last entry, 1 year provided leave and undertimes are posted in the leave card, 2 years after date of last entry'),
('106', 'Medical Certificates in Support of Absence on Account of Illness/Maternity', NULL, '3 years after absences had been recorded in leave cards'),
('107', 'Membership Files', 'GSIS, Pag-ibig, PhilHealth', '15 years after separated/retired'),
('108', 'Merit Promotion Plans', NULL, '1 year after superseded'),
('109', 'Performance Files', 'Appraisal, Evaluation, Rating Cards, Target Worksheets', '1 year, 1 year, 5 years, 1 year'),
('11', 'Gate Passes', NULL, '6 months'),
('110', 'Permissions to Engage in Business/Private Practice/Teach', NULL, '2 years after expired'),
('111', 'Personal Data Sheets (Curriculum Vitae/Resume)', NULL, '1 year after superseded'),
('112', 'Personnel Folders (201 Files)', 'Appointments, Acceptance of Resignation, etc.', '15 years after separated/retired'),
('113', 'Plantilla of Personnel', NULL, 'PERMANENT while other copies dispose after 3 years'),
('114', 'Position Allocation Lists', NULL, '3 years'),
('115', 'Position Classifications and Pay Plans', NULL, '5 years after superseded'),
('116', 'Recommendations/Referrals', NULL, '1 year after acted upon'),
('117', 'Reports', 'Examinations, Personnel Actions', '2 years, PERMANENT'),
('118', 'Requests', 'Accumulated Leave Credits, Approval on Promotions, etc.', '1 year after acted upon/cleared'),
('119', 'Salary Standardization Records', NULL, '5 years after superseded'),
('12', 'Inquiries', NULL, '2 years after acted upon'),
('120', 'Staffing Patterns', NULL, 'PERMANENT'),
('121', 'Service Cards', NULL, 'PERMANENT'),
('122', 'Statements of Assets and Liabilities', NULL, '10 years'),
('123', 'Administrative Cases', NULL, '7 years after finally settled except Decisions which are Permanent'),
('124', 'Affidavits', NULL, '1 year after purpose had been served'),
('125', 'Articles of Incorporation/By-Laws', NULL, 'PERMANENT'),
('126', 'Complaints/Protests', NULL, '5 years after settled'),
('127', 'Contracts', NULL, '5 years after renewed/terminated and/or finally settled'),
('128', 'Decisions', NULL, 'PERMANENT'),
('129', 'Deeds', 'Donation, Sale', 'PERMANENT'),
('13', 'Issuances', 'Issued by or for the head of agency documenting policies/functions/programs of the agency', 'PERMANENT'),
('130', 'Legal Opinions', NULL, 'PERMANENT'),
('131', 'Memoranda of Agreement/Understanding', NULL, 'PERMANENT'),
('132', 'Petitions', NULL, '5 years after settled'),
('133', 'Resolutions', NULL, 'PERMANENT'),
('134', 'Special Powers of Attorney', NULL, '1 year after purpose had been served'),
('135', 'Subpoenas', 'Ad Testificandum, Duces Tecum', '3 years or to be filed with appropriate case'),
('136', 'Acknowledgement Receipts for Equipment (ARE)/Memorandum Receipts of Equipment (MRE)', 'Semi-Expendable and Non-Expendable Properties', '1 year after equipment had been returned'),
('137', 'Annual Procurements', 'Plans, Programs', '3 years'),
('138', 'Bids and Awards Committee Files', 'Abstracts, Invitations, Minutes, Pre/Post Qualifications, Publications, Resolutions', '5 years after contract of winner had been terminated/settled, others dispose after 1 year'),
('139', 'Bills of Lading', NULL, '2 years after delivery had been accepted'),
('13a', 'Issuances', 'Issued by or for the head of agency reflecting routinary information or instruction', '2 years after superseded'),
('14', 'Lists', 'Associations, Committees, Cooperatives, Donors, Mailing, Transmittal, Others', '1 year after updated'),
('140', 'Bin Cards/Stock Cards on Supplies', NULL, '3 years after date of last entry'),
('141', 'Canvass of Prices', NULL, '10 years if attached to vouchers, otherwise, dispose after 2 years'),
('142', 'Equipment Ledger Cards', NULL, '2 years after equipment had been disposed'),
('143', 'Inventory and Inspection Reports of Unserviceable Properties', NULL, '1 year after property had been disposed'),
('144', 'Inventories of Equipment/Supplies', NULL, '1 year after updated'),
('145', 'Inventory Tag Cards', NULL, '1 year after issued'),
('146', 'Invoices / Receipts', 'Accountable Forms, Properties/Transfer of Properties', '3 years after issuance of clearance had been terminated/property had been returned'),
('147', 'Invoices of Delivery on Supply Open-End Order Contracts', NULL, '5 years'),
('148', 'Job Orders', NULL, '1 year'),
('149', 'Lists of Supplies Under Supply Open-End', NULL, '5 years'),
('15', 'Logbooks', 'Incoming/Outgoing Correspondences, Visitors (Ordinary, VIP), Others', '2 years after date of last entry, PERMANENT, 2 years after date of last entry'),
('150', 'Monthly Reports of Supplies and Materials Issued', NULL, '1 year'),
('151', 'Property Cards', NULL, 'PERMANENT'),
('152', 'Purchase Orders', NULL, '4 years'),
('153', 'Purchase Requests', NULL, '1 year'),
('154', 'Queries on Prices of Articles, Additional Funds to Meet Quotations', NULL, '1 year'),
('155', 'Reports of Waste Materials', NULL, '2 years'),
('156', 'Requisition and Issue Slips/Requisition Issue Vouchers', NULL, '1 year or file with appropriate records series'),
('157', 'Shipping and Packing Lists on Items Purchased', NULL, '1 year'),
('158', 'Suppliers Identification Certificates with Procurement', NULL, '2 years after renewed'),
('159', 'Supplies Adjustment Sheets', NULL, '1 year after post-audited'),
('16', 'Manuals', NULL, 'PERMANENT'),
('160', 'Supplies Availability Inquiries', NULL, '1 year'),
('161', 'Supplies Ledger Cards', NULL, '5 years'),
('162', 'Supplies Purchase Journals', NULL, 'PERMANENT'),
('163', 'Calendars', NULL, '1 year after superseded'),
('164', 'Course Designs/Outlines/Syllabi', NULL, '1 year after superseded'),
('165', 'Masterlists', 'Participants', 'PERMANENT'),
('166', 'Seminars Conducted/Coordinated Resource Speaker Profiles', NULL, '1 year after superseded'),
('167', 'Schedules of Training/Seminar', NULL, '1 year after superseded'),
('168', 'Survey Evaluation Questionnaires', NULL, '1 year after data had been evaluated'),
('169', 'Training Handouts', NULL, '1 year after superseded'),
('17', 'Meetings/Proceedings Files', 'Agenda, Minutes (Board/Executive Committee, Staff), Notices', '1 year, PERMANENT, 1 year, 1 year'),
('170', 'Training Programs/Plans', NULL, '3 years after superseded'),
('171', 'Training Reports', NULL, '2 years'),
('172', 'Workshop Results', NULL, '1 year'),
('18', 'Official Gazettes', NULL, 'PERMANENT'),
('19', 'Permits', NULL, '1 year after renewed/expired'),
('2', 'Brochures/Leaflets/Phamplets', 'About or by the agency', '1 year provided 1 copy is retained for reference'),
('20', 'Plans', 'Action/Work, Others', '3 years after implemented, PERMANENT if implemented, otherwise dispose 5 years from date of record'),
('21', 'Press Releases', 'About or by the agency', 'PERMANENT'),
('22', 'Programs', 'Work, Others', '3 years, PERMANENT if implemented, otherwise dispose 5 years from date of record'),
('23', 'Proposals', NULL, 'PERMANENT if implemented, otherwise dispose 5 years from date of record'),
('24', 'Publications (Record Set)', NULL, 'PERMANENT'),
('25', 'Reorganization Records', NULL, 'PERMANENT'),
('26', 'Reports', 'Annual/Special, Others', 'PERMANENT, 2 years after incorporated in the Annual Report'),
('27', 'Requests', NULL, '2 years after acted upon'),
('28', 'Slips', 'Locator, Permission, Routing', '1 year'),
('29', 'Speeches (Record Set)', NULL, 'PERMANENT'),
('3', 'Calendars/Schedules of Activities or Events', NULL, '1 year'),
('30', 'Standard Operating Procedures (SOP)', NULL, 'PERMANENT'),
('31', 'Telegrams', NULL, '1 year after acted upon'),
('32', 'Trip Tickets', NULL, '1 year'),
('33', 'Allotment Files', 'Advices of Allotment, Agency Budget Matrices, Allotment Release Orders, Obligation Request/Slips, Plan of Work and Requests, etc.', '3 years'),
('34', 'Annual Budgets', NULL, '3 years'),
('35', 'Budget Estimates Including Analysis Sheets and Estimates of Income', NULL, '3 years'),
('36', 'Budget Expenditures', 'Programs, Sources of Financing', '5 years'),
('37', 'Budget Issuances', 'Those used as authority for agency transactions', '10 years'),
('38', 'Budget Sheet Analysis', NULL, '3 years'),
('39', 'Budgetary Ceilings', NULL, '3 years'),
('4', 'Certificates of Appearance/Clearances', NULL, '1 year'),
('40', 'Cash Allocation Ceilings/Notices of Cash Allocation', NULL, '3 years'),
('41', 'Certifications of Funds Availability', NULL, '1 year'),
('42', 'General Appropriations Acts', NULL, '3 years'),
('43', 'Organizational Performance Indicator Framework (OPIF)', NULL, 'PERMANENT'),
('44', 'Physical Reports of Operations', NULL, '3 years'),
('45', 'Special/Supplemental Budgets', NULL, '3 years'),
('46', 'Work and Financial Plans', NULL, '3 years'),
('47', 'Abstracts', 'Daily Collections, Deposits and Trust Funds, General Collections, Sub-Vouchers', '5 years, 5 years, 5 years, 2 years'),
('48', 'Advices', 'Checks Issued & Cancelled, Remittance', '4 years, 10 years'),
('49', 'Annual Statements of Accounts Payable', NULL, 'PERMANENT'),
('5', 'Certifications', NULL, '1 year'),
('50', 'Auditor\'s Contract Cards', NULL, '3 years'),
('51', 'Authorities for Allowances', NULL, '2 years after terminated'),
('52', 'Authorizations', 'Overtime, Purchase of Equipment/Property, Transfer of Fund, Travel, Others', '1 year after expired'),
('53', 'Bank Slips', 'Deposits, Remittances', '10 years'),
('54', 'Bills', NULL, '10 years after settled'),
('55', 'Bonding Files', 'Action, Applications/Requests, Fidelity/Surety Bond, Indemnity for issue of Due Warrant', '3 years, 3 years, 5 years after expired/terminated, 3 years'),
('56', 'Books of Final Entry', 'General Ledgers, Subsidiary Ledgers', 'PERMANENT'),
('57', 'Books of Original Entry', 'Cash Disbursement Journals, Cash Journals, etc.', 'PERMANENT'),
('58', 'Cash Flow Charts', NULL, 'PERMANENT'),
('59', 'Certificates', 'Settlement and Balances, Shortages', '10 years provided post-audited, finally settled and not involved in any case, 10 years after settled'),
('6', 'Charts', 'Functional, Organizational', 'PERMANENT'),
('60', 'Claims', 'Insurance, Health Benefits, Hospital', '10 years after settled'),
('61', 'Checks and Check Stubs', NULL, '10 years provided post-audited, finally settled and not involved in any case'),
('62', 'Daily Cash Flow', NULL, '3 years'),
('63', 'Daily Statement of Collections', NULL, '5 years'),
('64', 'Expense Ledgers', NULL, 'PERMANENT'),
('65', 'Financial Statements', 'Balance Sheets, Income Statements, Statements of Cash Flows, Statements of Operation', 'PERMANENT'),
('66', 'Indices of Payments', 'Creditors, Employees, Sundry Payments by Checks/Warrants', '5 years, 15 years after retired/separated, PERMANENT'),
('67', 'Journal Entry Vouchers', NULL, '12 years provided post-audited, finally settled and not involved in any case'),
('68', 'Lists of Remittances', 'Loans, Premiums', 'PERMANENT'),
('69', 'Logbooks of General Funds', NULL, '3 years after date of last entry'),
('7', 'Correspondences', 'Non-routine, Routine', 'To be filed with appropriate records series, 2 years after acted upon'),
('70', 'Monthly Settlements of Monthly Subsidiary Ledger Balance', NULL, '2 years'),
('71', 'Notices', 'Disallowances, Suspensions', '3 years after settled'),
('72', 'Official Cash Books', NULL, 'PERMANENT'),
('73', 'Official Cash Books for Bank Cash Book', NULL, 'PERMANENT'),
('74', 'Official Receipts', NULL, '10 years provided post-audited, finally settled and not involved in any case'),
('75', 'Orders of Payment', NULL, '10 years'),
('76', 'Payrolls', NULL, '10 years provided post-audited, finally settled and not involved in any case'),
('77', 'Payroll Payment Slips/Pay Slips', NULL, '10 years'),
('78', 'Quarterly Statements of Charges to Accounts Payable', NULL, '10 years'),
('79', 'Registry Books of Checks Released', NULL, 'PERMANENT'),
('8', 'Delivery Receipts', NULL, '2 years'),
('80', 'Registers', 'Checks/Warrants, Checks/Warrants Control', 'PERMANENT'),
('81', 'Reliefs from Accountability', 'Decisions, Requests', '10 years provided a copy is filed with 201 files'),
('82', 'Reports', 'Accountabilities for Accountable Forms, Cash Disbursements, Cash Examinations, etc.', '3 years after cash had been examined, 10 years, 3 years provided post-audited, etc.'),
('83', 'Schedules of Accounts Receivables', NULL, '3 years'),
('84', 'Statements', 'Accounts (Current, Payable, Receivable), Common Funds, etc.', '3 years, 10 years, PERMANENT, 10 years, PERMANENT, 10 years'),
('85', 'Summaries of Unliquidated Obligations and Accounts Payable', NULL, '10 years'),
('86', 'Sundry Payments', NULL, '10 years'),
('87', 'Treasury Checking Accounts of Agency (TCAA)', NULL, '10 years'),
('88', 'Treasury Drafts', NULL, '10 years'),
('89', 'Treasury Warrants', NULL, '10 years provided post-audited, finally settled and not involved in any case'),
('9', 'Directories of Employees/Officials', NULL, '2 years after superseded'),
('90', 'Trial Balances and Supporting Schedules', 'Cumulative Results of Operations, Final Annual Trial Balances, Monthly/Quarterly Trial Balances', 'PERMANENT, 10 years after Annual Financial Report had been published, 2 years after consolidated in the Annual Financial Report'),
('91', 'Vouchers, including Bills, Invoices & Other Supporting Documents', 'Disbursements, Journals, Petty Cash, etc.', '10 years provided post-audited, finally settled...'),
('92', 'Withholding Tax Certificates', NULL, '4 years after superseded'),
('93', 'Annual Summary Reports for Replacement Program for Non-Eligibles', NULL, '5 years'),
('94', 'Applications', 'Employment, Leave of Absence, Relief of Accountability, Retirement/Resignation', '1 year, 1 year after recorded in the leave cards, 5 years after separated/retired, 1 year'),
('95', 'Attendance Monitoring Sheets', NULL, '1 year'),
('96', 'Authorities/Requests to Create or Fill Vacant Positions', NULL, '2 years after vacant positions had been filled up'),
('97', 'Certifications', 'Employment, Residency, Service, Others', '1 year'),
('98', 'Comparative Data Matrix of Employees', NULL, '2 years'),
('99', 'Daily Time Records', NULL, '1 year after data had been posted in leave cards and post-audited');

-- --------------------------------------------------------

--
-- Table structure for table `document_requests`
--

CREATE TABLE `document_requests` (
  `id` int(11) NOT NULL,
  `record_id` int(11) NOT NULL COMMENT 'The record being requested',
  `requester_user_id` int(11) NOT NULL COMMENT 'The user who made the request',
  `purpose` text NOT NULL,
  `requester_id_image_path` varchar(512) NOT NULL COMMENT 'Path to the uploaded ID for verification',
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `approver_user_id` int(11) DEFAULT NULL COMMENT 'The Admin who processed the request',
  `remarks` text DEFAULT NULL COMMENT 'Optional notes from the approver',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `publicly_available_documents`
-- (See below for the actual view)
--
CREATE TABLE `publicly_available_documents` (
`id` int(11)
,`record_series_title_description` text
,`period_covered` varchar(255)
,`department_name` varchar(255)
,`department_id` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `records`
--

CREATE TABLE `records` (
  `id` int(11) NOT NULL,
  `record_series_title_description` text NOT NULL COMMENT 'Column 9: Record Series Title and Description',
  `period_covered` varchar(255) DEFAULT NULL COMMENT 'Column 10: Period Covered / Inclusive Dates',
  `volume` varchar(100) DEFAULT NULL COMMENT 'Column 11: Volume (e.g., cubic feet)',
  `record_medium` varchar(100) DEFAULT NULL COMMENT 'Column 12: Records Medium (e.g., Paper, Digital)',
  `restrictions` varchar(255) DEFAULT NULL COMMENT 'Column 13: Restrictions (e.g., "Publicly Available", "Confidential")',
  `location` varchar(255) DEFAULT NULL COMMENT 'Column 14: Physical location of records',
  `frequency_of_use` varchar(100) DEFAULT NULL COMMENT 'Column 15: Frequency of Use',
  `duplication` varchar(100) DEFAULT NULL COMMENT 'Column 16: Duplication',
  `time_value` enum('T','P') DEFAULT NULL COMMENT 'Column 17: T for Temporary, P for Permanent',
  `utility_value` varchar(50) DEFAULT NULL COMMENT 'Column 18: Adm, F, L, Arc',
  `retention_period_active` varchar(50) DEFAULT NULL COMMENT 'Column 19: Active period',
  `retention_period_storage` varchar(50) DEFAULT NULL COMMENT 'Column 19: Storage period',
  `retention_period_total` varchar(50) DEFAULT NULL COMMENT 'Column 19: Total retention period',
  `disposition_provision` varchar(255) DEFAULT NULL COMMENT 'Column 20: Disposition Provision',
  `date_of_record` date DEFAULT NULL COMMENT 'The anchor date for calculating disposal (e.g., date created, date superseded)',
  `calculated_disposal_date` date DEFAULT NULL COMMENT 'Automatically calculated by the system for disposal reminders',
  `department_id` int(11) NOT NULL COMMENT 'Links the record to a specific department',
  `created_by_user_id` int(11) NOT NULL COMMENT 'Links the record to the user who created it',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `records`
--
DELIMITER $$
CREATE TRIGGER `after_record_insert_log` AFTER INSERT ON `records` FOR EACH ROW BEGIN
    -- Get department name for the log entry
    DECLARE dept_name_val VARCHAR(255);
    SELECT name INTO dept_name_val FROM departments WHERE id = NEW.department_id;

    -- Insert into the activity log
    INSERT INTO `activity_logs` (
        `user_id`, 
        `office`, 
        `operation`, 
        `action_date_time`, 
        `record_series_title_description`
    ) 
    VALUES (
        NEW.created_by_user_id,
        dept_name_val,
        'Upload',
        CURRENT_TIMESTAMP,
        NEW.record_series_title_description
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `record_files`
--

CREATE TABLE `record_files` (
  `id` int(11) NOT NULL,
  `record_id` int(11) NOT NULL COMMENT 'Links the file to a specific record in the inventory',
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(512) NOT NULL COMMENT 'Storage path on the server or cloud',
  `file_type` varchar(100) NOT NULL,
  `file_size_bytes` bigint(20) NOT NULL,
  `uploaded_by_user_id` int(11) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `school_id` varchar(11) NOT NULL COMMENT 'User ID for login, format: 22-1-02642',
  `password_hash` varchar(255) NOT NULL COMMENT 'Stores hashed passwords for security',
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('Admin','Departmental Record Custodian','Staff') NOT NULL,
  `department_id` int(11) DEFAULT NULL COMMENT 'Foreign key to departments table. NULL for Admin.',
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure for view `publicly_available_documents`
--
DROP TABLE IF EXISTS `publicly_available_documents`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `publicly_available_documents`  AS SELECT `r`.`id` AS `id`, `r`.`record_series_title_description` AS `record_series_title_description`, `r`.`period_covered` AS `period_covered`, `d`.`name` AS `department_name`, `r`.`department_id` AS `department_id` FROM (`records` `r` join `departments` `d` on(`r`.`department_id` = `d`.`id`)) WHERE `r`.`restrictions` = 'Publicly Available' ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `disposition_schedule`
--
ALTER TABLE `disposition_schedule`
  ADD PRIMARY KEY (`item_number`);

--
-- Indexes for table `document_requests`
--
ALTER TABLE `document_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `record_id` (`record_id`),
  ADD KEY `requester_user_id` (`requester_user_id`),
  ADD KEY `approver_user_id` (`approver_user_id`);

--
-- Indexes for table `records`
--
ALTER TABLE `records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `created_by_user_id` (`created_by_user_id`);

--
-- Indexes for table `record_files`
--
ALTER TABLE `record_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `record_id` (`record_id`),
  ADD KEY `uploaded_by_user_id` (`uploaded_by_user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `school_id` (`school_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `department_id` (`department_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document_requests`
--
ALTER TABLE `document_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `records`
--
ALTER TABLE `records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `record_files`
--
ALTER TABLE `record_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `document_requests`
--
ALTER TABLE `document_requests`
  ADD CONSTRAINT `document_requests_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `records` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `document_requests_ibfk_2` FOREIGN KEY (`requester_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `document_requests_ibfk_3` FOREIGN KEY (`approver_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `records`
--
ALTER TABLE `records`
  ADD CONSTRAINT `records_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `records_ibfk_2` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `record_files`
--
ALTER TABLE `record_files`
  ADD CONSTRAINT `record_files_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `records` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `record_files_ibfk_2` FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
