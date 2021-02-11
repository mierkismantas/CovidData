FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0-buster-slim AS build
WORKDIR /src
COPY ["CovidApi.csproj", "./"]
RUN dotnet restore "CovidApi.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "CovidApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CovidApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CovidApi.dll"]
