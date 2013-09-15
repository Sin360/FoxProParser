DEFINE CLASS Arrays AS Test

	PROCEDURE Assignments

		&& single one dimension assignments
		aTab1(1) = 0
		aTab2[1] = 0

		&& two dimension assignments
		aTab3(1,1) = 0
		aTab4[1,1] = 0

		&& dimensioning one dimension arrays
		DIMENSION aTab5(1)
		DIMENSION aTab6[1]

		&& dimensioning two dimensions arrays
		DIMENSION aTab7(1,2)
		DIMENSION aTab8[1,2]

	ENDPROC

	PROCEDURE Declarations

		&& single one dimension declarations
		LOCAL ARRAY aParSinOneTab1(1)
		LOCAL ARRAY aBraSinOneTab1[1]

		&& multiple one dimension declarations
		LOCAL ARRAY aParMulOneTab1(1), aParMulOneTab2(1), aParMulOneTab3(1)
		LOCAL ARRAY aBraMulOneTab1[1], aBraMulOneTab2[1], aBraMulOneTab3[1]

		&& single two dimension declarations
		LOCAL ARRAY aParSinTwoTab1(1,2)
		LOCAL ARRAY aBraSinTwoTab1[1,2]

		&& multiple two dimension declarations
		LOCAL ARRAY aParMulTwoTab1(1,2), aParMulTwoTab2(1,2), aParMulTwoTab3(1,2)
		LOCAL ARRAY aBraMulTwoTab1[1,2], aBraMulTwoTab2[1,2], aBraMulTwoTab3[1,2]

		&& two dimension declarations with a space after comma
		LOCAL ARRAY aTab1(1, 2)
		LOCAL ARRAY aTab2[1, 2]

	ENDPROC

ENDDEFINE