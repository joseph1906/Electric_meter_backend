-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: ReactTask
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `paymentmode`
--

DROP TABLE IF EXISTS `paymentmode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentmode` (
  `TransactionID` varchar(255) NOT NULL,
  `ID` int DEFAULT NULL,
  `Phone_number` varchar(255) NOT NULL,
  `Method` varchar(255) NOT NULL,
  `Amount` varchar(255) NOT NULL,
  `Unit_purchase` varchar(255) NOT NULL,
  `deleted_by_user` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`TransactionID`),
  KEY `FK_RegistrationID` (`ID`),
  CONSTRAINT `FK_RegistrationID` FOREIGN KEY (`ID`) REFERENCES `registration` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentmode`
--

LOCK TABLES `paymentmode` WRITE;
/*!40000 ALTER TABLE `paymentmode` DISABLE KEYS */;
INSERT INTO `paymentmode` VALUES ('TXN17762484866176711',12,'0750989518','Airtel','5000','5',1),('TXN177624977442651',12,'jeanrobertsawasawa8@gmail.com','PayPal','5000','5',0),('TXN17762498716073568',12,'MasterCard_7891','MasterCard','9000','9',1),('TXN17766348727139329',12,'0750989518','Airtel','80000','80',0),('TXN17768040057837479',15,'0750989518','Airtel','50000','50',0),('TXN1776805428268432',15,'0750989518','Airtel','50000','50',0),('TXN17768346560664453',13,'0750989519','Airtel','5000','5',0);
/*!40000 ALTER TABLE `paymentmode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registration`
--

DROP TABLE IF EXISTS `registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Firstname` varchar(100) NOT NULL,
  `Lastname` varchar(100) NOT NULL,
  `NationalId` varchar(50) DEFAULT NULL,
  `Telephone` varchar(20) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `District` varchar(100) DEFAULT NULL,
  `MeterNumber` varchar(50) DEFAULT NULL,
  `PhaseType` varchar(50) DEFAULT NULL,
  `Declaration` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `otp` varchar(6) DEFAULT NULL,
  `otp_expires` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registration`
--

LOCK TABLES `registration` WRITE;
/*!40000 ALTER TABLE `registration` DISABLE KEYS */;
INSERT INTO `registration` VALUES (1,'Jo','Sawa','1232112321','0977853370','jo@gmail.com','$2b$10$AImNpeO558dMGlmWa4TSQu2k0IIxksZfkysCPDtnRfPTcwWQcIBOS','Wakiso','123432123','Single Phase',1,'2026-04-08 16:36:03',NULL,NULL,0),(2,'Jos','Sawa','123457678','0977853370','jos@gmail.com','$2b$10$byXIYiz0uscz7mbyWJgcY.Mv5CC7Q228LDh3obuK50N2KW.vzCtRO','Mukono','1231232567','Single Phase',1,'2026-04-08 17:10:40',NULL,NULL,0),(3,'Jose','Marie','123421','0977853370','jose@gmail.com','$2b$10$8BB74a.7D363TMGxIz8g0eIlbAVfzT1XqEl005bRVHbr.6aMkUdoS','Wakiso','131233223','Single Phase',1,'2026-04-08 17:14:20',NULL,NULL,0),(4,'josep','man','12345','0977853370','josep@gmail.com','$2b$10$gsgsSuKCwB5FZt/0pIv4AeEw0UIKqIuJX/JBdS1U0NPkBsO7MDkji','Mukono','123212321','Three Phase',1,'2026-04-08 17:16:24',NULL,NULL,0),(5,'joseph','Marie','12321321','0977853370','joseph@gmail.com','$2b$10$XiJYfFiBMQ4cvxLS6Vv/C.6.RXWG2nBOsxwySj7GDa65pTUb53dUO','Mukono','12432123232','Three Phase',1,'2026-04-08 17:20:12',NULL,NULL,0),(6,'Jer','kob','12321321232','0977853370','jer@gmail.com','$2b$10$oED8H0PH03TwNSdxRh61a.4oGBRf.n0cSSFDKUr8dhqxGxgnrkKla','Wakiso','123432232e','Three Phase',1,'2026-04-08 17:30:36',NULL,NULL,0),(7,'Jer','Jo','1234542123','0977853370','jerome@gmail.com','$2b$10$Pcx9IcbRaTgCetMUheVmF.9jUng54eTWHDXDlRCp3uPA4IE5hhwSe','Wakiso','1234543212345','Single Phase',1,'2026-04-08 17:38:39',NULL,NULL,0),(8,'Dan','Mov','12345','0977853370','dan@gmail.com','$2b$10$d7iWprnobL2tMy0ZC3SC6OozyZ/Y7QE6cwolScHzxWUqAcSP4W/M2','Buikwe','1234','Three Phase',1,'2026-04-12 16:01:28',NULL,NULL,0),(9,'Dov','Mov','12345','0977853370','dov@gmail.com','$2b$10$fAamxcS0rwi/9Ws1/fRHA.KmpK5T17eK6jhp9r9hYdg3rSOK2vrRi','Buhweju','1234','Single Phase',1,'2026-04-12 16:12:06',NULL,NULL,0),(10,'Joro','jorob','123321323','0977853370','joro@gmail.com','$2b$10$UIyF770rPuX30WLPcDDU6O0xb0yv7fwQlzh/fvYOKXg53FPHgBLOy','Bududa','0909','Three Phase',1,'2026-04-12 16:40:07',NULL,NULL,0),(11,'Drov','drova','23453456','0977853370','drov@gmail.com','$2b$10$clg3RBxdTScA7Yt/tnNKFekv8ovZFvrPE1EBOr7HNyg.xalmIIExK','Bukedea','788767878','Single Phase',1,'2026-04-12 17:14:52',NULL,NULL,0),(12,'josi','josaise','67876776787','0977853370','josi@gmail.com','$2b$10$pe1VhM.7qWKfPHYrFsYOo.Pk6iKS7pX7lDAPxmj31RnnzWRJXurpa','Bukomansimbi','676567656','Three Phase',1,'2026-04-12 17:17:57',NULL,NULL,0),(13,'Joseph','SAWA-SAWA','12345678','0750989518','josephsajsawasawa@gmail.com','$2b$10$otFNK/2JDbVnbjhxVJu3der3Q6abUs0gtgadND3ubqDOVcqgFDnAm','Bukedea','234321234321','Single Phase',1,'2026-04-21 07:13:23',NULL,NULL,1),(14,'Jhon','Kabangu','12345678','0977853370','jhonkabangu45@gmail.com','$2b$10$ZTjWLWSqOqE3H9h2l2yTIOP/vsXMSuVdc5.3ws3xLcF60jrHNCZSO','Bukomansimbi','1233232','Three Phase',1,'2026-04-21 17:42:58','602836','2026-04-21 22:51:33',1),(15,'Yannick','Deka','123432443432','0977853370','yankbg2@gmail.com','$2b$10$ZjjpOyBTBq.pwOMl4/x/j.I3E1TD5JC0oHnwrbhJxPY3Iq6ERiGYa','Bukedea','1234321345432123','Three Phase',1,'2026-04-21 20:33:29',NULL,NULL,1);
/*!40000 ALTER TABLE `registration` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-25  5:23:57
