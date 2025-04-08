-- ����� ����� �� ��� ��� �����
IF OBJECT_ID('People', 'U') IS NOT NULL
    DROP TABLE People;

-- ����� ���� ������
CREATE TABLE People (
    Person_Id INT PRIMARY KEY,
    Personal_Name NVARCHAR(50),
    Family_Name NVARCHAR(50),
    Gender NVARCHAR(10),
    Father_Id INT NULL,
    Mother_Id INT NULL,
    Spouse_Id INT NULL
);

-- ����� ������ ������
INSERT INTO People (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
(1, '����', '�����', '���', NULL, NULL, 2),
(2, '�����', '�����', '����', NULL, NULL,NULL),
(3, '���', '�����', '���', 1, 2, NULL),
(4, '���', '�����', '����', 1, 2, NULL),
(5, '���', '�����', '���', 1, 2, NULL),
(6, '����', '�����', '����', NULL, NULL, 5);


-- ����� ����� �� ��� ��� �����
IF OBJECT_ID('FamilyTree', 'U') IS NOT NULL
    DROP TABLE FamilyTree;

-- ����� ���� �� �����
CREATE TABLE FamilyTree (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type NVARCHAR(20),
    PRIMARY KEY (Person_Id, Relative_Id)
);

-- ����� �����
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Father_Id, '��' FROM People WHERE Father_Id IS NOT NULL
UNION
SELECT Person_Id, Mother_Id, '��' FROM People WHERE Mother_Id IS NOT NULL;

-- ����� ����� (��/��)
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT Father_Id, Person_Id, '��' FROM People WHERE Father_Id IS NOT NULL AND Gender = '���'
UNION
SELECT Father_Id, Person_Id, '��' FROM People WHERE Father_Id IS NOT NULL AND Gender = '����'
UNION
SELECT Mother_Id, Person_Id, '��' FROM People WHERE Mother_Id IS NOT NULL AND Gender = '���'
UNION
SELECT Mother_Id, Person_Id, '��' FROM People WHERE Mother_Id IS NOT NULL AND Gender = '����';

-- ����� ���� ������
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT P1.Person_Id, P2.Person_Id, 
       CASE WHEN P1.Gender = '���' THEN '��' ELSE '����' END
FROM People P1
JOIN People P2 ON P1.Father_Id = P2.Father_Id
WHERE P1.Person_Id <> P2.Person_Id AND P1.Father_Id IS NOT NULL
UNION
SELECT P1.Person_Id, P2.Person_Id, 
       CASE WHEN P1.Gender = '���' THEN '��' ELSE '����' END
FROM People P1
JOIN People P2 ON P1.Mother_Id = P2.Mother_Id
WHERE P1.Person_Id <> P2.Person_Id AND P1.Mother_Id IS NOT NULL;

-- ����� ��� ��� ������ ����� �����
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT P1.Person_Id, P1.Spouse_Id, 
       CASE WHEN P1.Gender = '���' THEN '�� ���' ELSE '�� ���' END
FROM People P1
WHERE P1.Spouse_Id IS NOT NULL AND 
      NOT EXISTS (
          SELECT 1 FROM FamilyTree F WHERE F.Person_Id = P1.Person_Id AND F.Relative_Id = P1.Spouse_Id
      );

INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT P1.Spouse_Id, P1.Person_Id, 
       CASE WHEN P1.Gender = '���' THEN '�� ���' ELSE '�� ���' END
FROM People P1
WHERE P1.Spouse_Id IS NOT NULL AND 
      NOT EXISTS (
          SELECT 1 FROM FamilyTree F WHERE F.Person_Id = P1.Spouse_Id AND F.Relative_Id = P1.Person_Id
      );

-- ����� ������� �����
SELECT * FROM FamilyTree;
