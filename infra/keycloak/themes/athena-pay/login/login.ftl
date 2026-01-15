<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>
    <#if section = "header">
        <div class="athena-logo">
            <div class="athena-dot"></div>
            <span class="athena-text">Athena</span>
        </div>
        <p class="athena-subtitle">${msg("loginAccountTitle")}</p>
    <#elseif section = "form">
        <div id="kc-form">
            <div id="kc-form-wrapper">
                <#if realm.password>
                    <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                        <div class="form-group">
                            <label for="username" class="control-label">
                                <#if !realm.loginWithEmailAllowed>${msg("username")}<#elseif !realm.registrationEmailAsUsername>${msg("usernameOrEmail")}<#else>${msg("email")}</#if>
                            </label>
                            <input tabindex="1" id="username" class="form-control" name="username" value="${(login.username!'')}"  type="text" autofocus autocomplete="off"
                                   aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                                   placeholder="<#if !realm.loginWithEmailAllowed>${msg("username")}<#elseif !realm.registrationEmailAsUsername>${msg("usernameOrEmail")}<#else>${msg("email")}</#if>"
                            />
                            <#if messagesPerField.existsError('username','password')>
                                <span id="input-error" class="help-block" aria-live="polite">
                                    ${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}
                                </span>
                            </#if>
                        </div>

                        <div class="form-group">
                            <label for="password" class="control-label">${msg("password")}</label>
                            <input tabindex="2" id="password" class="form-control" name="password" type="password" autocomplete="off"
                                   aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                                   placeholder="${msg("password")}"
                            />
                        </div>

                        <div class="form-group login-options">
                            <#if realm.rememberMe && !usernameEditDisabled??>
                                <div class="checkbox">
                                    <label>
                                        <#if login.rememberMe??>
                                            <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" checked> ${msg("rememberMe")}
                                        <#else>
                                            <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox"> ${msg("rememberMe")}
                                        </#if>
                                    </label>
                                </div>
                            </#if>

                            <#if realm.resetPasswordAllowed>
                                <div class="forgot-password">
                                    <a tabindex="5" href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a>
                                </div>
                            </#if>
                        </div>

                        <div id="kc-form-buttons" class="form-group">
                            <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
                            <input tabindex="4" class="btn btn-primary btn-block btn-lg" name="login" id="kc-login" type="submit" value="${msg("doLogIn")}"/>
                        </div>
                    </form>
                </#if>
            </div>
        </div>
    <#elseif section = "info">
        <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
            <div id="kc-registration">
                <span>${msg("noAccount")} <a tabindex="6" href="${url.registrationUrl}">${msg("doRegister")}</a></span>
            </div>
        </#if>
    <#elseif section = "socialProviders">
        <#if realm.password && social.providers??>
            <div id="kc-social-providers">
                <div class="login-pf-social-section-title">
                    <span>ou continue com</span>
                </div>
                <ul class="social-providers">
                    <#list social.providers as p>
                        <li>
                            <a id="social-${p.alias}" class="zocial ${p.providerId}" href="${p.loginUrl}">
                                <span class="social-icon"></span>
                                <span>${p.displayName}</span>
                            </a>
                        </li>
                    </#list>
                </ul>
            </div>
        </#if>
    </#if>

</@layout.registrationLayout>

<style>
    .athena-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 8px;
    }

    .athena-dot {
        width: 14px;
        height: 14px;
        background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(201, 162, 39, 0.6);
        animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 20px rgba(201, 162, 39, 0.6); }
        50% { box-shadow: 0 0 30px rgba(201, 162, 39, 0.8); }
    }

    .athena-text {
        font-size: 28px;
        font-weight: 800;
        color: #FFFFFF;
        letter-spacing: -0.5px;
    }

    .athena-subtitle {
        text-align: center;
        color: #A3A3A3;
        font-size: 15px;
        margin-top: 8px;
    }

    .login-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 16px 0;
    }

    .forgot-password a {
        font-size: 13px;
    }

    .social-providers {
        list-style: none;
        padding: 0;
        margin: 0;
    }
</style>
