package com.citamed.config;

import com.citamed.domain.user.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Servicio para la generación y validación de JSON Web Tokens (JWT).
 */
@Service
public class JwtService {

    // Inyecta el secreto desde application.properties
    @Value("${jwt.secret}")
    private String JWT_SECRET;

    // Define el tiempo de vida del token (ej. 24 horas)
    private static final long TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    /**
     * Extrae el 'subject' (email/username) del token.
     */
    public String getUsernameFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Valida un token contra un UserDetails.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        // Valida que el email en el token coincida y que el token no haya expirado
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Genera un nuevo token JWT para un usuario.
     */
    public String generateToken(UserDetails userDetails) {
        // Aseguramos que podemos acceder a los campos personalizados de Usuario
        Usuario usuario = (Usuario) userDetails;

        // Añade 'claims' personalizados (id_usuario y rol)
        Map<String, Object> claims = new HashMap<>();
        claims.put("id_usuario", usuario.getIdUsuario());
        claims.put("rol", usuario.getRol().name());

        return buildToken(claims, userDetails, TOKEN_EXPIRATION_TIME);
    }

    // --- Métodos privados de ayuda ---

    /**
     * Construye el token JWT final con los claims, sujeto y expiración.
     */
    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername()) // 'subject' es el email
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), Jwts.SIG.HS512) // Firma con HS512
                .compact();
    }

    /**
     * Verifica si el token ha expirado.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extrae la fecha de expiración del token.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Función genérica para extraer un 'claim' específico del token.
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Parsea el token y extrae todos los 'claims'.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Obtiene y decodifica la clave secreta (HS512) desde la config.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(JWT_SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}