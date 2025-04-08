-- מחיקת הטבלה אם היא כבר קיימת
IF OBJECT_ID('People', 'U') IS NOT NULL
    DROP TABLE People;

-- יצירת טבלת האנשים
CREATE TABLE People (
    Person_Id INT PRIMARY KEY,
    Personal_Name NVARCHAR(50),
    Family_Name NVARCHAR(50),
    Gender NVARCHAR(10),
    Father_Id INT NULL,
    Mother_Id INT NULL,
    Spouse_Id INT NULL
);

-- הוספת נתונים לדוגמה
INSERT INTO People (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
(1, 'אהרן', 'ריינר', 'זכר', NULL, NULL, 2),
(2, 'יוכבד', 'ריינר', 'נקבה', NULL, NULL,NULL),
(3, 'משה', 'ריינר', 'זכר', 1, 2, NULL),
(4, 'ארי', 'ריינר', 'נקבה', 1, 2, NULL),
(5, 'יעל', 'ריינר', 'זכר', 1, 2, NULL),
(6, 'מיכל', 'ריינר', 'נקבה', NULL, NULL, 5);


-- מחיקת הטבלה אם היא כבר קיימת
IF OBJECT_ID('FamilyTree', 'U') IS NOT NULL
    DROP TABLE FamilyTree;

-- יצירת טבלת עץ משפחה
CREATE TABLE FamilyTree (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type NVARCHAR(20),
    PRIMARY KEY (Person_Id, Relative_Id)
);

-- הוספת הורים
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Father_Id, 'אב' FROM People WHERE Father_Id IS NOT NULL
UNION
SELECT Person_Id, Mother_Id, 'אם' FROM People WHERE Mother_Id IS NOT NULL;

-- הוספת ילדים (בן/בת)
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Father_Id, Person_Id, 'בן' FROM People WHERE Father_Id IS NOT NULL AND Gender = 'זכר'
UNION
SELECT Father_Id, Person_Id, 'בת' FROM People WHERE Father_Id IS NOT NULL AND Gender = 'נקבה'
UNION
SELECT Mother_Id, Person_Id, 'בן' FROM People WHERE Mother_Id IS NOT NULL AND Gender = 'זכר'
UNION
SELECT Mother_Id, Person_Id, 'בת' FROM People WHERE Mother_Id IS NOT NULL AND Gender = 'נקבה';

-- הוספת אחים ואחיות
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT P1.Person_Id, P2.Person_Id, 
       CASE WHEN P1.Gender = 'זכר' THEN 'אח' ELSE 'אחות' END
FROM People P1
JOIN People P2 ON P1.Father_Id = P2.Father_Id
WHERE P1.Person_Id <> P2.Person_Id AND P1.Father_Id IS NOT NULL
UNION
SELECT P1.Person_Id, P2.Person_Id, 
       CASE WHEN P1.Gender = 'זכר' THEN 'אח' ELSE 'אחות' END
FROM People P1
JOIN People P2 ON P1.Mother_Id = P2.Mother_Id
WHERE P1.Person_Id <> P2.Person_Id AND P1.Mother_Id IS NOT NULL;

-- הוספת בני זוג והשלמת קשרים חסרים
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT P1.Person_Id, P1.Spouse_Id, 
       CASE WHEN P1.Gender = 'זכר' THEN 'בן זוג' ELSE 'בת זוג' END
FROM People P1
WHERE P1.Spouse_Id IS NOT NULL AND 
      NOT EXISTS (
          SELECT 1 FROM FamilyTree F WHERE F.Person_Id = P1.Person_Id AND F.Relative_Id = P1.Spouse_Id
      );

INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT P1.Spouse_Id, P1.Person_Id, 
       CASE WHEN P1.Gender = 'זכר' THEN 'בת זוג' ELSE 'בן זוג' END
FROM People P1
WHERE P1.Spouse_Id IS NOT NULL AND 
      NOT EXISTS (
          SELECT 1 FROM FamilyTree F WHERE F.Person_Id = P1.Spouse_Id AND F.Relative_Id = P1.Person_Id
      );

-- בדיקה שהתוצאה נכונה
SELECT * FROM FamilyTree;
