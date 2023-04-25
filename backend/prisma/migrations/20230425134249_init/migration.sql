-- CreateTable
CREATE TABLE "refreshTokens" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "refreshTokens_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "forgotPasswordTokens" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "forgotPasswordTokens_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "refreshTokens_userId_key" ON "refreshTokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "forgotPasswordTokens_userId_key" ON "forgotPasswordTokens"("userId");
