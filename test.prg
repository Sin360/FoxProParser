DEFINE CLASS Mop AS Custom

	cText = ""
	cPicto = ""

	* -- Initisalition
	PROCEDURE Init

		LPARAMETERS cAbrev, cLabel

		LOCAL ARRAY aArray(1)

	ENDPROC

	FUNCTION Get

		LPARAMETERS cAbrev

		LOCAL oDBF

		M.oDBF = CREATEOBJECT("OpenDBF")

		RETURN M.cAbrev

	ENDFUNC

ENDDEFINE